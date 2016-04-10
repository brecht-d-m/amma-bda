/*
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

/// <reference path="../../../externs/ts/node/node.d.ts" />
/// <reference path="common.d.ts" />

import callbacks = require('./callbacks');
import childProcess = require('child_process');
import fs = require('fs');
import logging = require('./logging');
import path = require('path');
import userManager = require('./userManager');

var MIN_SYNC_INTERVAL: number = 60 * 1000;
var MAX_SYNC_RETRY: number = 30;

/**
 * The application settings instance.
 */
var appSettings: common.Settings = null;
var branchName: string = null;
var repoUrl: string = null;

/**
 * Pending sync requests for all users. key is user Id, and value is the number of
 * times it has retried due to failure. If a user Id doesn't exist, it means there is
 * no pending request for the user.
 */
var syncRequests: common.Map<number> = {};

/**
 * Tracks whether workspace has been initialized for each user. We could check user directory
 * to to determine that, but it is too costly since every request will go through this path.
 */
var userWorkspaceInitialized: common.Map<boolean> = {};

/**
 * Callback manager to coordinate initialization requests so that only one goes through for
 * each user.
 */
var callbackManager: callbacks.CallbackManager = new callbacks.CallbackManager();

function makeCommitId()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for(var i=0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Calls 'wsync sync' to do an on-demand sync
 */
function updateWorkspace(userId: string, userDir: string, repoUrl: string, workspaceName: string,
                         cb: common.Callback0) {
  var commitMessage = makeCommitId();

    var gitSyncCommand = 'git --git-dir=' + userDir + '/.git --work-tree=' + userDir + ' add .; ' + 
        'git --git-dir=' + userDir + '/.git --work-tree=' + userDir + ' commit -m "' + commitMessage + '"; ' +
        'git --git-dir=' + userDir + '/.git --work-tree=' + userDir + ' push -u -f origin master';
 
    childProcess.exec(gitSyncCommand, { env: process.env }, function (err, stdout, stderr) {
        if (err) {
            logging.getLogger().error(err, 'git sync failed for dir %s. stderr: %s', userDir, stderr);
        }
        cb && cb(err);
    });
}

/**
 * Initialize workspace for given user, including 'git clone', 'wsync checkout', and 'wsync sync'
 */
function initializeWorkspace(userId: string, userDir: string, repoUrl: string, workspaceName: string,
                            branch: string, cb: common.Callback0) {
  // TODO; find good way to define user + repoURL + first time login
    var gitCloneCommand = 'git clone -b ' + branch + ' --single-branch ' + repoUrl + ' ' + userDir;
    childProcess.exec(gitCloneCommand, { env: process.env }, function (err, stdout, stderr) {
        if (err) {
            logging.getLogger().error(err, 'git clone failed for dir %s. stderr: %s', userDir, stderr);
            cb && cb(err);
            return;
        }
    });
}

/**
 * Global initialization.
 */
export function init(settings: common.Settings): void {
  appSettings = settings;

  branchName = 'datalab_' + settings.instanceName;
  //repoUrl = 'https://source.developers.google.com/p/' + settings.projectId;
  repoUrl = 'https://github.com/brecht-d-m/test.git' // Via bash variable
}

/**
 * Whether the workspace has been initialized for the given user.
 */
export function isWorkspaceInitialized(userId: string): boolean {
  var userDir = userManager.getUserDir(userId);
  return (userWorkspaceInitialized[userDir] == true);
}

/**
 * Sync immediately. If workspace has been initialized, go ahead and sync.
 * Otherwise, start the initialization and then sync.
 */
export function updateWorkspaceNow(userId: string, cb: common.Callback0) {
  var userDir = userManager.getUserDir(userId);
  if (!callbackManager.checkOngoingAndRegisterCallback(userId, cb)) {
    return;
  }
  var workspaceName = 'acropolis__' + userId + '__' + branchName;
  if (fs.existsSync(userDir) && fs.readdirSync(userDir).length > 0) {
    userWorkspaceInitialized[userDir] = true;
    updateWorkspace(userId, userDir, repoUrl, workspaceName, function(e) {
      callbackManager.invokeAllCallbacks(userId, e);
    });
    return;
  }

  logging.getLogger().info('Initializing workspace for %s.', userId);
  initializeWorkspace(userId, userDir, repoUrl, workspaceName, branchName, function(e) {
    if (!e) {
      userWorkspaceInitialized[userDir] = true;
      logging.getLogger().info('Initial sync completed for %s.', userId);
    }
    callbackManager.invokeAllCallbacks(userId, e);
  });
}

/**
 * Schedule a sync request. If there is already a sync request pending for the given
 * user, do nothing.
 */
export function scheduleWorkspaceUpdate(userId: string) {
  if (syncRequests[userId]) {
    // A sync is already scheduled and will run soon.
    return;
  }
  syncRequests[userId] = 1;

  function deferredUpdate() {
    updateWorkspaceNow(userId, function(e) {
      if (!e) {
        // sync succeeded. Clean up.
        delete syncRequests[userId];
      }
      else {
        syncRequests[userId] = syncRequests[userId] + 1;
        if (syncRequests[userId] < MAX_SYNC_RETRY) {
          logging.getLogger().info('Reschedule sync for user: %s for %d times.',
                                   userId, syncRequests[userId]);
          setTimeout(deferredUpdate, MIN_SYNC_INTERVAL);
        }
        else {
          // TODO: Store a sync status for the user, so it can be reported
          logging.getLogger().error('Sync has failed %d times for user %s. Give up.',
                                    MAX_SYNC_RETRY, userId);
          delete syncRequests[userId];
        }
      }
    });
  }

  setTimeout(deferredUpdate, MIN_SYNC_INTERVAL);
}
