(function () {
	var input = document.getElementById("files"), 
		formdata = false;  

	if (window.FormData) {
  		formdata = new FormData();
  		document.getElementById("btn").style.display = "none";
	}
	
 	input.addEventListener("change", function (evt) {
 		document.getElementById("response").innerHTML = "Uploading . . ."
 		var i = 0, len = this.files.length, file;
	
		for ( ; i < len; i++ ) {
			file = this.files[i];
	
				if (formdata) {
					formdata.append("files[]", file);
				}
		}
	
		if (formdata) {
			$.ajax({
				url: "/user/cecozeucozebuo/upload",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function (res) {
					document.getElementById("response").innerHTML = JSON.stringify(res); 
				}
			});
		}
	}, false);
}());
