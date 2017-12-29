function doGet(e) {
  const params = JSON.stringify(e);
  //If not parameter specified, go to index
  if(params.page == undefined){
    params.page = "index";
  }
  
  const html = HtmlService.createHtmlOutputFromFile(params.page);
  
  for(var i = 0; i < param_names.length; i++){
    html.addMetaTag(param_names[i], params[param_names[i]]);
  }
  
  return 
}


//Returns the url of the current script for page navigation
function getScriptUrl(){
  return ScriptApp.getService().getUrl();
}