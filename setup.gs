function setupMain(){
  //Done: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  addDepartments();
}

function addCourses(nsheet){
  var srcDocUrl = "https://docs.google.com/spreadsheets/d/1Dxpt_GEnandi16k15hHculhY2bjYRFpL_GdJpeGeVD0/edit#gid=1073495431";
  var outDocUrl = "https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0";
  var curSheet = SpreadsheetApp.openByUrl(outDocUrl).getSheets()[0];
  var curValues = curSheet.getRange("A:C").getValues();
  var curCodes = copyColumn(curValues, 0);
  var sheet = null;
  if(typeof nsheet == "number"){
    sheet = SpreadsheetApp.openByUrl(srcDocUrl).getSheets()[nsheet];
  }
  else if(typeof nsheet == "string"){
    sheet = SpreadsheetApp.openByUrl(srcDocUrl).getSheetByName(nsheet);
  }
  Logger.log("Starting sheet: " + nsheet);
  console.log("Starting sheet: " + nsheet);
  //Get codes and names
  var values = sheet.getRange("A:B").getValues();
  //Loop through all of the codes and names
  for(var i = 1; i < values.length; i++){
    //If exists in current list
    var index = curCodes.indexOf(values[i][0]);
    if(i % 100 == 0){
        console.log("Finished " + i.toString() + " of " + values.length + " in " + sheet.getName());
        Logger.log("Finished " + i.toString() + " of " + values.length + " in " + sheet.getName());
    }
    if(index < 0){
      //Format as object
      var course_info = sheet.getName().toString() + "-" + i.toString() + ";";
      curCodes.push(values[i][0]);
      //Add to curValues array
      curValues.push([values[i][0], values[i][1], course_info]);
      //Add to the actual sheet
      curSheet.appendRow([values[i][0], values[i][1], course_info]);
      //Logger.log("Added: " + course_info);
    }
    else{
      //Get existing json array and check if already contains semester
      if(curValues[index][2].indexOf(sheet.getName()) < 0){
        curValues[index][2] = sheet.getName().toString() + "-" + i.toString() + ";" + curValues[index][2];
        var cell = curSheet.getRange("A:C").getCell(index + 1, 3);
        cell.setValue(curValues[index][2]);
      }
    }
    SpreadsheetApp.flush();
  }
  Logger.log("Finished sheet " + nsheet.toString());
  console.log("Finshed sheet " + nsheet.toString());
  SpreadsheetApp.flush();
}

//Removes leading whitespaces from all cells in column ncol
//Starts from nrow and goes to end
//Note: ncol and nrow are not zero indexed, based on spreadsheet numbers
function removeLeadingSpace(ncol, nrow){
  if(ncol == undefined) ncol = 2;
  if(nrow == undefined) nrow = 2;
  const url = "https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0";
  const sheet = SpreadsheetApp.openByUrl(url).getSheets()[0];
  const range = sheet.getRange("A:C");
  for(var i = nrow; i <= range.getLastRow(); i++){
    var cell = range.getCell(i, ncol);
    var value = String(cell.getValue());
    if(value[0] == " "){
      value = value.substring(1);
      cell.setValue(value);
      SpreadsheetApp.flush();
    } 
  }
}

function addDepartments(courseStartIndex, deptCountStart){
  //Optional parameter for the start index in the course list
  //Minimum value is 1 due to title row
  if(courseStartIndex == undefined || courseStartIndex < 1){
    courseStartIndex = 1;
  }

  //Optional parameter for the starting department ROW in departments sheet.
  //Minimum value should be zero since getCell is not zero indexed and need one row for title
  if(deptCountStart == undefined || deptCountStart < 2){
    deptCountStart = 2;
  }

  //Get all the sheets
  const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets();

  const codes = sheets[0].getRange("A:A").getValues();
  const deptRange = sheets[1].getRange("A:C");

  var startIndex = courseStartIndex;

  //Store the current department to add to
  var curDept = codes[courseStartIndex][0].split(" ")[0];
  
  //Store the index of the current department
  var deptCount = deptCountStart;
  
  for(var i = courseStartIndex + 1; i < codes.length; i++){
    //Get the department title
    var dept = codes[i][0].split(" ")[0];
    if(dept != curDept){
      deptRange.getCell(deptCount, 1).setValue(curDept);
      deptRange.getCell(deptCount, 2).setValue(startIndex);
      deptRange.getCell(deptCount, 3).setValue(i - 1);
      Logger.log(curDept + " completed\n");
      console.log(curDept + " completed\n");

      curDept = dept;
      startIndex = i;
      deptCount += 1;
    }
  }
  
  deptRange.getCell(deptCount, 1).setValue(curDept);
  deptRange.getCell(deptCount, 2).setValue(startIndex);
  deptRange.getCell(deptCount, 3).setValue(codes.length - 1);
  Logger.log(curDept + " completed\n");
  console.log(curDept + " completed\n");
}

//Creates an array with the given column number in values
function copyColumn(values, col){
  var arr = [];
  for(var i = 0; i < values.length; i++){
    arr.push(values[i][col]);
  } 
  return arr;
}