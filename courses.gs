function course(code, name, infoStr) {
    this.code = code;
    this.name = name;
    this.infoStr = infoStr;
    this.infos = parseInfo(infoStr);
}

function course_info(semester, line) {
    this.semester = semester;
    this.line = line
    this.recommend = -1;
    this.workload = -1;
    this.enrollment = -1;
}