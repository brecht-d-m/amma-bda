# Project Advanced Multimedia Applications
## Description
**Notebooks and data science: interactive analytics in the cloud** is a project for the Advanced Multimedia Applications course (2016). 

The goal of this project is to integrate [Google Cloud Datalab](https://github.com/GoogleCloudPlatform/datalab) into Datatonic's A3S framework for uploading and processing Big Data. [Datatonic](http://datatonic.com/) wants to extend the frameworks functionality with notebook support, hosted in the cloud to allow easy sharing, and to provide the possibility of creating and sharing multiple views.

The project assignment can be found in [this](https://drive.google.com/file/d/0B53EfjtXGCsZMGJocVhKVVh4LXM/view?usp=sharing) and [this](https://drive.google.com/file/d/0B53EfjtXGCsZbWJsdVpXUXh2WmM/view?usp=sharing) document. The progress report can be found [here](https://docs.google.com/document/d/19M65j4-htc807Qn7PPmBugY6hF5t0tzNs1J5PF-ruIc/edit?usp=sharing).

**Team members:**
* Frédérique De Baerdemaeker
* Brecht De Meulenaere
* Samuel Huylebroeck
* Bart Middag

## Extension Datalab
### Demo
We have uploaded a video of the product where we show some of the features of the project. Click on the image below to go to the video. 

[![YouTubeLink](https://i.ytimg.com/vi/oICdHkth6FU/sddefault.jpg)](https://youtu.be/oICdHkth6FU)

### Docker image
We have uploaded a Docker image: [Docker image](https://hub.docker.com/r/bredmeul/datalab/). To run the demo, please follow the instruction on the [GitHub page](https://github.com/googlecloudplatform/datalab/wiki/Build-and-Run#running) of Google Datalab.

### New Features
Google Cloud Datalab is extended with different features:
* Different types of views: full view, code view, text view, text with output view
* Export of the code view and text view (the new notebook and old notebook are both saved)
* Opening of a notebook in a specific view
* Different notebook extensions: IPyWidgets, Collapsible Headings, and Codefolding ([nbextensions](https://github.com/ipython-contrib/IPython-notebook-extensions)). Other nbextensions can be added more easily.
  - The IPyWidgets allow (together with the "text with output view") to make a dashboard view ([StackOverflow](stackoverflow.com/questions/36404809/execute-ipywidgets-in-google-cloud-datalab/36806675#36806675))
  - Collapsible headings: sections of the notebook can be easily hided
  - Codefolding: code sections can be collapsed
* Easy customization of header and footer (background color - text color and font - company name, logo and url)
