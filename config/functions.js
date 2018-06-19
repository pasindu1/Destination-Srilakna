
$(document).ready(function(){
	$('#new_vehi_btn').click(function(){
		var color_id = document.getElementById('colorselect').value;
		var brand_id = document.getElementById('brandselect').value;
		var model_id = document.getElementById('modelselect').value;
		var type_id = document.getElementById('typeselect').value;
		var description = document.getElementById('description1').value;
		var rate = document.getElementById('rate').value;
		var start = document.getElementById('datepicker').value;
		var end = document.getElementById('datepicker1').value;
		var condition = document.getElementById('conditionselect').value;
    var data = new FormData();

    $.each($("input[name='vehi_img']")[0].files, function(i, file) {
        data.append('vehi_img', file);
    });
		data.append("colorid", color_id);
		data.append("brandid", brand_id);
		data.append("modelid", model_id);
		data.append("typeid", type_id);
		data.append("desc", description);
		data.append("rate",rate);
		data.append("start",start);
		data.append("end",end);
		data.append("condition",condition);
		$('#new_vehi_btn').attr("data-dismiss","modal");



    $.ajax({
        method: 'POST',
        url: '/vendor/vendor_registration',
        cache: false,
        contentType: false,
        processData: false,
        data : data,
        success: function(result){
            //alert("result");
						$('#list_image_details').removeClass('active');
						$('#list_image_details').removeAttr('href data-toggle');
						$('#image_details').removeClass('active');
						$('#list_image_details').addClass('disabled');
						$('#list_vehicle_details').removeClass('disabled');
						$('#list_vehicle_details').addClass('active');
						$('#list_vehicle_details').attr('href','#vehicle-details');
						$('#list_vehicle_details').attr('data-toggle','tab');
						$('#vehicle-details').addClass('active in');
						$("#txtFirstName").val('blank');
						$("#brandselect").val('blank');
						$("#modelselect").val('blank');
						$("#typeselect").val('blank');
						$("#colorselect").val('blank');
						$('#description1').val('');
						$('#datepicker1').val('');
						$('#datepicker').val('');
						$('#rate').val('');
						$('conditionselect').val('blank');
						$('#preview img').remove();
        },
        error: function(err){
            console.log(err);
        }
    })
	});
});

//
// $(document).ready(function(){
// 	$('#new_vehi_btn').click(function(){
//
// 		var color_id = document.getElementById('colorselect').value;
// 		var date = document.getElementById('datepicker').value;
// 		var brand_id = document.getElementById('brandselect').value;
// 		var model_id = document.getElementById('modelselect').value;
// 		var type_id = document.getElementById('typeselect').value;
// 		var description = document.getElementById('description1').value;
// 		$('#new_vehi_btn').attr("data-dismiss","modal");
// 		$.ajax({
// 			url: '/vendor/register_vendor?type_id='+type_id,
// 			method: 'GET',
// 			data:{
// 				brandid1:brand_id,
// 				colorid:color_id,
// 				date:date,
// 				modelid:model_id,
// 				typeid:type_id,
// 				desc:description
// 			},
// 			dataType:'json',
// 			success:function(result){
//
// 				// $('#list_personal_details').removeClass('active');
// 				// $('#list_personal_details').removeAttr('href data-toggle');
// 				// $('#personal-details').removeClass('active');
// 				// $('#list_personal_details').addClass('disabled');
// 				// $('#list_vehicle_details').removeClass('disabled');
// 				// $('#list_vehicle_details').addClass('active');
// 				// $('list_vehicle_details').attr('href','#vehicle-details');
// 				// $('list_vehicle_details').attr('data-toggle','tab');
// 				// $('#vehicle-details').addClass('active in');
//
// 				$('#list_image_details').removeClass('active');
// 				$('#list_image_details').removeAttr('href data-toggle');
// 				$('#image_details').removeClass('active');
// 				$('#list_image_details').addClass('disabled');
// 				$('#list_vehicle_details').removeClass('disabled');
// 				$('#list_vehicle_details').addClass('active');
// 				$('#list_vehicle_details').attr('href','#vehicle-details');
// 				$('#list_vehicle_details').attr('data-toggle','tab');
// 				$('#vehicle-details').addClass('active in');
// 				$("#txtFirstName").val('blank');
// 				$("#brandselect").val('blank');
// 				$("#modelselect").val('blank');
// 				$("#typeselect").val('blank');
// 				$("#colorselect").val('blank');
// 				$('#description1').val('');
// 				$('#datepicker').val('');
// 				$('#preview img').remove();
//
//
//
// 			}
//
// 		});
// 	});
// });
