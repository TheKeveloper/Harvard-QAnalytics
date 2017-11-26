function doGet(e) {
  const params = JSON.stringify(e);
  if(params.page == undefined){
    params.page = "index";
  }
  return HtmlService.createHtmlOutputFromFile(params.page);
}

function getScriptUrl(){
  return ScriptApp.getService().getUrl();
}
