function doGet(e) {
  const params = JSON.stringify(e);
  //If not parameter specified, go to index
  if(params.page == undefined){
    params.page = "index";
  }

  return HtmlService.createHtmlOutputFromFile(params.page);
}


//Returns the url of the current script for page navigation
function getScriptUrl(){
  return ScriptApp.getService().getUrl();
}