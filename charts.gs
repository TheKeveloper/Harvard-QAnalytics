//Parameters: course object
//Returns a built datatable
//Columns: Semester, Recommend, Workload, Enrollment
function createDataTable(course){
  var infos = course.infos;
  //Sort the infos array
  infos.sort(infoCompare);
  
  var data = Charts.newDataTable();
  data.addColumn(Charts.ColumnType.STRING, "Semester");
  data.addColumn(Charts.ColumnType.NUMBER, "Recommend");
  data.addColumn(Charts.ColumnType.NUMBER, "Workload");
  data.addColumn(Charts.ColumnType.NUMBER, "Enrollment");
  for(var i = 0; i < infos.length; i++){
    data.addRow([infos[i].semester, infos[i].recommend, infos[i].workload, infos[i].enrollment]);
  }
  return data.build();
}

//Format should be: "season year"
//E.g. "Fall 2017"
//Sorts from least recent to most recent;
function infoCompare(a, b){
  //Separate year and season
  const astrs = a.semester.split(" ");
  const bstrs = b.semester.split(" ");
  
  //Sort by year
  if(astrs[1] != bstrs[1]){  
    return astrs[1] - bstrs[1];
  }
  
  //Sort by season
  return bstrs[1] - astrs[1];
}

function infoCompare(a, b){
  const astrs = a.semester.split(" ");
  const bstrs = b.semester.split(" ");
  if(astrs[1] != bstrs[1]){
    return astrs[1] - bstrs[1];
  }
  
}