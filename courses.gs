//Retrieve the courses in the list
//Retrieves from startIndex to endIndex - 1. If not specified, gets all courses
//Optional parameter sheet to avoid reloading sheet. Creates new by default
//Optional parameter minSems indicates minimum number of semesters course was offered for inclusion
function getCourses(startIndex, endIndex, sheet, minSems) {
    if (minSems === undefined) {
        minSems = 2;
    }
    if (sheet == undefined) {
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

function getCourse(code, sheet){
    var c = getCourse(code, sheet);
    getCourseRatings(c);
    return c;
}

//Does a binary search on the course list for code
//Returns a course object if found
//Returns null if not found
function binsearchCourse(code, sheet){
    code = code.replace("_", " ");
    if(sheet == undefined){
        sheet = sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[0];
    }

    var values = sheet.getRange("A:C").getValues();

    var low = 0;
    var high = values.length - 1;
    var mid = Math.floor((low + high) / 2);

    while(low < high){
        if(values[mid][0] === code){
            return course(values[mid][0], values[mid][1], values[mid][2]);
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
        return course(values[mid][0], values[mid][1], values[mid][2]);
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
    if (!course) {
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