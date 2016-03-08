# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
# in compliance with the License. You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License
# is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
# or implied. See the License for the specific language governing permissions and limitations under
# the License.

import unittest
import gcp.bigquery
import mock
from oauth2client.client import AccessTokenCredentials


class TestCases(unittest.TestCase):

  @mock.patch('gcp.bigquery._api.Api.tabledata_list')
  @mock.patch('gcp.bigquery._api.Api.jobs_insert_query')
  @mock.patch('gcp.bigquery._api.Api.jobs_query_results')
  @mock.patch('gcp.bigquery._api.Api.jobs_get')
  @mock.patch('gcp.bigquery._api.Api.tables_get')
  def test_single_result_query(self, mock_api_tables_get, mock_api_jobs_get,
                               mock_api_jobs_query_results, mock_api_insert_query,
                               mock_api_tabledata_list):
    mock_api_tables_get.return_value = self._create_tables_get_result()
    mock_api_jobs_get.return_value = {'status': {'state': 'DONE'}}
    mock_api_jobs_query_results.return_value = {'jobComplete': True}
    mock_api_insert_query.return_value = self._create_insert_done_result()
    mock_api_tabledata_list.return_value = self._create_single_row_result()

    sql = 'SELECT field1 FROM [table] LIMIT 1'
    q = self._create_query(sql)
    results = q.results()

    self.assertEqual(sql, results.sql)
    self.assertEqual('(%s)' % sql, q._repr_sql_())
    self.assertEqual(sql, str(q))
    self.assertEqual(1, results.length)
    first_result = results[0]
    self.assertEqual('value1', first_result['field1'])

  @mock.patch('gcp.bigquery._api.Api.jobs_insert_query')
  @mock.patch('gcp.bigquery._api.Api.jobs_query_results')
  @mock.patch('gcp.bigquery._api.Api.jobs_get')
  @mock.patch('gcp.bigquery._api.Api.tables_get')
  def test_empty_result_query(self, mock_api_tables_get, mock_api_jobs_get,
                              mock_api_jobs_query_results, mock_api_insert_query):
    mock_api_tables_get.return_value = self._create_tables_get_result(0)
    mock_api_jobs_get.return_value = {'status': {'state': 'DONE'}}
    mock_api_jobs_query_results.return_value = {'jobComplete': True}
    mock_api_insert_query.return_value = self._create_insert_done_result()

    q = self._create_query()
    results = q.results()

    self.assertEqual(0, results.length)

  @mock.patch('gcp.bigquery._api.Api.jobs_insert_query')
  @mock.patch('gcp.bigquery._api.Api.jobs_query_results')
  @mock.patch('gcp.bigquery._api.Api.jobs_get')
  @mock.patch('gcp.bigquery._api.Api.tables_get')
  def test_incomplete_result_query(self,
                                   mock_api_tables_get,
                                   mock_api_jobs_get,
                                   mock_api_jobs_query_results,
                                   mock_api_insert_query):
    mock_api_tables_get.return_value = self._create_tables_get_result()
    mock_api_jobs_get.return_value = {'status': {'state': 'DONE'}}
    mock_api_jobs_query_results.return_value = {'jobComplete': True}
    mock_api_insert_query.return_value = self._create_incomplete_result()

    q = self._create_query()
    results = q.results()

    self.assertEqual(1, results.length)
    self.assertEqual('test_job', results.job_id)

  @mock.patch('gcp.bigquery._api.Api.jobs_insert_query')
  def test_malformed_response_raises_exception(self, mock_api_insert_query):
    mock_api_insert_query.return_value = {}

    q = self._create_query()

    with self.assertRaises(Exception) as error:
      _ = q.results()
    self.assertEqual('Unexpected response from server', error.exception[0])

  def test_udf_expansion(self):
    sql = 'SELECT * FROM udf(source)'
    udf = gcp.bigquery.UDF('inputs', [('foo', 'string'), ('bar', 'integer')], 'udf', 'code')
    context = self._create_context()
    query = gcp.bigquery.Query(sql, udf=udf, context=context)
    self.assertEquals('SELECT * FROM (SELECT foo, bar FROM udf(source))', query.sql)

    # Alternate form
    query = gcp.bigquery.Query(sql, udfs=[udf], context=context)
    self.assertEquals('SELECT * FROM (SELECT foo, bar FROM udf(source))', query.sql)

  def _create_query(self, sql=None):
    if sql is None:
      sql = 'SELECT * ...'
    return gcp.bigquery.Query(sql, context=self._create_context())

  def _create_context(self):
    project_id = 'test'
    creds = AccessTokenCredentials('test_token', 'test_ua')
    return gcp.Context(project_id, creds)

  def _create_insert_done_result(self):
    # pylint: disable=g-continuation-in-parens-misaligned
    return {
      'jobReference': {
        'jobId': 'test_job'
      },
      'configuration': {
        'query': {
          'destinationTable': {
            'projectId': 'project',
            'datasetId': 'dataset',
            'tableId': 'table'
          }
        }
      },
      'jobComplete': True,
    }

  def _create_single_row_result(self):
    # pylint: disable=g-continuation-in-parens-misaligned
    return {
      'totalRows': 1,
      'rows': [
        {'f': [{'v': 'value1'}]}
      ]
    }

  def _create_empty_result(self):
    # pylint: disable=g-continuation-in-parens-misaligned
    return {
      'totalRows': 0
    }

  def _create_incomplete_result(self):
    # pylint: disable=g-continuation-in-parens-misaligned
    return {
      'jobReference': {
        'jobId': 'test_job'
      },
      'configuration': {
        'query': {
          'destinationTable': {
            'projectId': 'project',
            'datasetId': 'dataset',
            'tableId': 'table'
          }
        }
      },
      'jobComplete': False
    }

  def _create_page_result(self, page_token=None):
    # pylint: disable=g-continuation-in-parens-misaligned
    return {
      'totalRows': 2,
      'rows': [
        {'f': [{'v': 'value1'}]}
      ],
      'pageToken': page_token
    }

  def _create_tables_get_result(self, num_rows=1, schema=None):
    if schema is None:
      schema = [{'name': 'field1', 'type': 'string'}]
    return {
      'numRows': num_rows,
      'schema': {
        'fields': schema
      },
    }
