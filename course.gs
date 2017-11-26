function test() {
    var courses = getCourses();
    getCourseRatings(courses[0]);
    Logger.log(courses[0].code + " enrollment: " + courses[0].infos[0].enrollment);
  }
  
  function getCourses(startIndex, endIndex, sheet, minSems){
    var start_time = Date.now();
    if(minSems == undefined){
      minSems = 2;
    }
    if(sheet === undefined || sheet == null){
      sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11tRpkgU0JoV_qTa_KsI8yEO6aLz8KY9wtGmIQXkdaXs/edit#gid=0").getSheets()[0];
    }
    var courses = [];
    var values = sheet.getRange("A:C").getValues();
    if(startIndex < 0){
      return null;
    }
    if(endIndex > values.length){
      endIndex = values.length;
    }
    for(var i = 1; i < values.length; i++){
      var c = new course(values[i][0], values[i][1], values[i][2]);
      //Only push if the course has some history
      if(c != undefined && c.infos.length >= minSems){
        courses.push(c);
      }
      //Reset c to undefined. This is stupid.
      c = undefined;
    }
    var time = Date.now() - start_time;
    Logger.log(courses[0].code + " " + courses[0].infos.length);
    Logger.log("Found " + courses.length.toString() + " courses. " + time.toString() + " elapsed");
    return courses;
  }
  
  function course(code, name, infoStr){
    this.code = code; 
    this.name = name;
    this.infoStr = infoStr;
    this.infos = parseInfo(infoStr);
  }
  
  function parseInfo(infoStr){
    //Split among different semester info
    const semesters = infoStr.split(";");
    //Array of course infos
    var infos = [];
    for(var i = 0; i < semesters.length; i++){
      if(semesters[i] != 0){
        const info = semesters[i].split("-");
        infos.push(new course_info(info[0], parseInt(info[1])));
      }
    }
    return infos;
  }
  
  // Takes an array of course_infos and a Spreadsheet doc (optional)
  // infos should already have been parsed
  // Modifies infos to include ratings and enrollment
  function getCourseRatings(course, doc){
    var infos = course.infos;
    if(!course){
      throw "NO COURSE SPECIFIED EXCEPTION";
      return;
    }
    if(doc === undefined){
      doc = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Dxpt_GEnandi16k15hHculhY2bjYRFpL_GdJpeGeVD0/edit#gid=1073495431");
    }
    
    for(var i = 0; i < infos.length; i++){
      var values = doc.getSheetByName(infos[i].semester).getRange("A:G").getValues();
      var row = values[infos[i].line];
      infos[i].enrollment = row[4];
      infos[i].recommend = row[5];
      infos[i].workload = row[6];
    }
    return infos;
  }
  
  function course_info(semester, line){
    this.semester = semester;
    this.line = line
    this.recommend = -1;
    this.workload = -1;
    this.enrollment = -1;
  }