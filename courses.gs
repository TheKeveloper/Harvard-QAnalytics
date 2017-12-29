//Retrieve the courses in the list
//Retrieves from startIndex to endIndex - 1. If not specified, gets all courses
//Optional parameter sheet to avoid reloading sheet. Creates new by default
//Optional parameter minSems indicates minimum number of semesters course was offered for inclusion
function getCourses(startIndex, endIndex, sheet, minSems) {
    if (minSems === undefined) {
        minSems = 2;
    }
    if (sheet == undefined || sheet == null) {
        sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[0];
    }
    var courses = [];
    var values = sheet.getRange("A:C").getValues();
    if (startIndex < 0) {
        return null;
    }
    if (endIndex > values.length) {
        endIndex = values.length;
    }
    for (var i = startIndex; i < endIndex; i++) {
        var c = new course(values[i][0], values[i][1], values[i][2]);
        //Only push if the course has some history
        if (c != undefined && c.infos.length >= minSems) {
            courses.push(c);
        }
        //Reset c to undefined. This is stupid.
        c = undefined;
    }
    return courses;
}

//Get all the courses in a department
function getDepartment(dept, sheet, minSems){
    if(dept == undefined){ 
        throw "ERROR: NO DEPARTMENT SPECIFIED";
        return;
    }
    if(sheet == undefined){
        sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[1];
    }
    
    //Strip any whitespaces
    dept = dept.replace(" ", "");
    
    const values = sheet.getRange("A:C").getValues();

    //Search for course
    for(var i = 1; i < values.length; i++){
        if(values[i][0] == dept){
            const startIndex = parseInt(values[i][1]);

            //endIndex has to be one greater because Departments spreadsheet is inclusive but getCourses is exclusive
            const endIndex = parseInt(values[i][2]) + 1;

            //Get all courses between those indices
            return getCourses(startIndex, endIndex, null, minSems);
        }
    }
    return null;
}

function getCourse(code, sheet){
    var c = binsearchCourse(code, true, sheet);
    getCourseRatings(c);
    return c;
}


//Does a binary search on the course list for code
//code: the code the search for
//searchDept: optional boolean for whether to search within a department for the course
//Returns a course object if found
//Returns null if not found
function binsearchCourse(code, searchDept, sheet){
    code = code.replace("_", " ");
    if(searchDept == undefined || searchDept == null){
        searchDept = false;
    }
    if(sheet == undefined){
        sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[0];
    }

    var values;

    if(searchDept){
        var deptValues = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[1].getRange("A:C").getValues();

        const dept = code.split(" ")[0].replace(" ", "")
        for(var i = 1; i < deptValues.length; i++){
            if(deptValues[i][0] == dept){
                const startIndex = parseInt(deptValues[i][1]);
                const endIndex = parseInt(deptValues[i][2]);

                values = sheet.getRange("A" + String(startIndex + 1) + ":C" + String(endIndex + 1));
                break;
            }
        }
        values = sheet.getRange("A:C").getValues();
    }
    else{
        values = sheet.getRange("A:C").getValues();
    }

    var low = 0;
    var high = values.length;
    var mid = Math.floor((low + high) / 2);

    while(low < high){
        if(values[mid][0] === code){
            return new course(values[mid][0], values[mid][1], values[mid][2]);
        }
        else if(code < values[mid][0]){
            high = mid;
            mid = Math.floor((low + high) / 2);
        }
        else if(code > values[mid][0]){
            low = mid;
            mid = Math.floor((low + high) / 2);
        }
    }

    if(values[low][0] === code){
        return new course(values[mid][0], values[mid][1], values[mid][2]);
    }
    else{
        return null;
    }
}

function findCourses(query, sheet, minSems){
    //Trim any white space and remove repeat spaces
    query = query.trim().replace("  ", " ");
    //If empty query, return null
    if(query == 0){
        return null;
    }
    if(sheet == undefined){
        sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[0];
    }
    if(minSems === undefined){
        minSems = 2;
    }
    var values = sheet.getRange("A:C").getValues();
    var courses = [];
    for(var i = 0; i < values.length; i++){
        //Check if contains
        if(values[i][0].contains(query) || values[i][1].contains(query)){
            var c = new course(values[i][0], values[i][1], values[i][2]);
            if(c != undefined && c.infos.length >= minSems){
                courses.push(c);
            }
            c = undefined;
        }
    }
    return courses;
}

function course(code, name, infoStr) {
    this.code = code;
    this.name = name;
    this.infoStr = infoStr;
    this.infos = parseInfo(infoStr);
}

function parseInfo(infoStr) {
    //Split among different semester info
    const semesters = infoStr.split(";");
    //Array of course infos
    var infos = [];
    for (var i = 0; i < semesters.length; i++) {
        if (semesters[i] != 0) {
            const info = semesters[i].split("-");
            infos.push(new course_info(info[0], parseInt(info[1])));
        }
    }
    return infos;
}

// Takes an array of course_infos and a Spreadsheet doc (optional)
// infos should already have been parsed
// Modifies infos to include ratings and enrollment
function getCourseRatings(course, doc) {
    if (course == null || course == undefined) {
        throw "NO COURSE SPECIFIED EXCEPTION";
        return;
    }
    var infos = course.infos;
    if (doc === undefined) {
        doc = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Dxpt_GEnandi16k15hHculhY2bjYRFpL_GdJpeGeVD0/edit#gid=1073495431");
    }

    for (var i = 0; i < infos.length; i++) {
        var values = doc.getSheetByName(infos[i].semester).getRange("A:G").getValues();
        var row = values[infos[i].line];
        infos[i].enrollment = row[4];
        infos[i].recommend = row[5];
        infos[i].workload = row[6];
    }
    return infos;
}

function course_info(semester, line) {
    this.semester = semester;
    this.line = line
    this.recommend = -1;
    this.workload = -1;
    this.enrollment = -1;
}