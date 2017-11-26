function doGet(e) {
  const params = JSON.stringify(e);
  //If not parameter specified, go to index
  if(params.page == undefined){
    params.page = "index";
  }
  //Set the parameters for later retrieval
  PropertiesService.getScriptProperties().setProperty("page", params.page);
  PropertiesService.getScriptProperties().setProperty("course_group", params.course_group);

  return HtmlService.createHtmlOutputFromFile(params.page);
}


//Returns the url of the current script for page navigation
function getScriptUrl(){
  return ScriptApp.getService().getUrl();
}

function getPage(){
  return PropertiesService.getScriptProperties().getProperty("page");
}

function getCourseGroupNumber(){
  return PropertiesSErvice.getScriptProperties().getProperty("course_group");
}