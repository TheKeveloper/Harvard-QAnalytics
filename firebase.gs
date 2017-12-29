//Manages all firebase accesses


//Returns the firebase url
function getFirebaseUrl(){
    return "https://q-analytics-kev.firebaseio.com/";
}

//Gets and returns a single course matching code from the firebase db
function getCourse(code){
    var db = FirebaseApp.getDatabaseByUrl(getFirebaseUrl());
    var queryParams = {"orderBy" : "code", "equalTo" : code};
    var data = db.getData("", queryParams);
    if(data.length > 0) {
        return data[0];
    }
    else{
        return data[1];
    }
}