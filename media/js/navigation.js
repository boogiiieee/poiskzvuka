var oktoGET = new function(){
  this.hash = window.location.hash;

  //Инициализация hash
  this.init = function(hash){
	this.hash = hash;
  }
  // Возвращает ассоциативный массив, сфоримрованный из hash.
  this.getParams = function(){
	var params = this.hash.split('?');

	var result = [];
	if (params[0]) {
		result['path'] = params[0];
	}
	if (params[1]) {
		p = params[1].split('&');
		for (var i = 0, max = p.length, pair; i < max; i++) {
			pair = p[i].split('=');
			(pair[0] && pair[1]) && (result[pair[0]] = pair[1]);
		}
	}
	return result;
  }
  
  // Собирает hash из массива. Параметр path в строке обязателен.
  this.setParams = function(p){
	var result = '';
	for (i in p) {
		if (p[i] && i!='path') {
			result += i+'='+p[i]+'&';
		}
	}
	var get_params = result.substr(0, result.length-1);
	if (get_params) {
		return p['path']+'?'+get_params;
	} else {
		return p['path'];
	}
  }
}



var IDx = new function(){
	this.idx = '';
	this.mas_idx = [];

	this.set_idx = function(){
		if(this.mas_idx.length){
			this.idx = this.mas_idx.join(',');
		} else { this.idx = ''; }
	}
	
	//Принимает на вход строку вида '2,1,4,6,7'
	this.init = function(str){
		if (str){
			mas = str.split(',');
			for(var i=0, j=0; i<mas.length; ++i){
				if (mas[i] && mas[i]*1){
					var flag = false;
					for(var k=0; k<=j; ++k){
						if(this.mas_idx[k] == mas[i]*1){ flag = true; }
					}
					if(!flag){ this.mas_idx[++j] = mas[i]*1;}
				}
			}
			this.set_idx();
		}
	}
	
	//Очистить
	this.clean = function(){
		this.idx = '';
		this.mas_idx = [];
	}
	
	//Возвращает размер
	this.size = function(){
		return this.mas_idx.length;
	}
	//Возвращает строку
	this.get_str = function(){
		return this.idx;
	}
	//Возвращает массив
	this.get_mas = function(){
		return this.mas_idx;
	}
	//Содержит ли элемент
	this.is_array = function(elm){
		for(var i=0; i<this.size(); ++i){
			if(this.mas_idx[i] == elm){
				return i;
			}
		}
		return -1;
	}
	//Добавить в конец. Возвращает true/false.
	this.push = function(elm){
		if(elm && elm*1 && this.is_array(elm)==-1){
			this.mas_idx.push(elm);
			this.set_idx();
			return true;
		}
		return false;
	}
	//Удалить по индексу. Нумерация с нуля. Возвращает true/false.
	this.del = function(index){
		if(index*1>=0 && index<this.size()){
			this.mas_idx.splice(index,1);
			this.set_idx();
			return true;
		}
		return false;
	}
	//Удалить по значению. Возвращает true/false.
	this.del_value = function(elm){
		if(elm*1){
			var index = this.is_array(elm);
			if(index!=-1){
				this.mas_idx.splice(index,1);
				this.set_idx();
				return true;
			}
		}
		return false;
	}
}
			


function go_to(id, callback){
	var go_id = $(id).offset().top-$('header').outerHeight();
	$('html, body').animate({scrollTop:go_id}, 750, callback);
	return false;
}
/*
function load_catalog(q, page, callback){
	if  (q && page*1){
		$("#cat_cd").load('/get_ajax/?q='+q+'&page='+page, {}, callback);
		return false;
	}
}
*/

function load_catalog(q, page, callback){
	if  (q && page*1){
		$.ajax({
			type: 'GET',
			url: '/get_ajax/?q='+q+'&page='+page+'',
			beforeSend: function() {
				$('#cat_cd').addClass('preloader');
			},
			complete: function(){
				$('#cat_cd').removeClass('preloader');
			},
			success: function(response){
				$("#cat_cd").html(response);
				callback;
			},
			error: function(){
				$("#cat_cd").html('<h3>Непредвидимая ошибка. Обратитесь к администраторам сайта.</h3>');
			},
		});
		return false;
	}
}

function load_item_catalog(id, q, page, item_id, flag){
	flag  = flag  || true;
	if  (q && page*1 && item_id*1){
		oktoGET.init(window.location.hash);
		var mas_hash = oktoGET.getParams();
		var q_new = mas_hash['q']
		var page_new = mas_hash['page']
		if (q!=q_new || page*1!=page_new*1)
		{
			IDx.clean();
			window.location.hash = oktoGET.setParams({'path':id, 'q':q, 'page':page, 'id':''});
			load_catalog(q, page, function(){
				if ($('#tr_'+item_id).next("tr").is(':visible')) {
					if (flag){$('#tr_'+item_id).next("tr").slideUp();};
					go_to('#tr_'+item_id, call_hide_show(id, q, page, item_id, true, flag));
				}else{
					$('#tr_'+item_id).next("tr").slideDown();
					go_to('#tr_'+item_id, call_hide_show(id, q, page, item_id, false));
				};
			});
		}else{
			if ($('#tr_'+item_id).next("tr").is(':visible')) {
				if (flag){$('#tr_'+item_id).next("tr").slideUp();};
				go_to('#tr_'+item_id, call_hide_show(id, q, page, item_id, true, flag));
			}else{
				$('#tr_'+item_id).next("tr").slideDown();
				go_to('#tr_'+item_id, call_hide_show(id, q, page, item_id, false));
			};
		}
		return false;
	}
}


// если flag - True, то удалить иначе добавить в IDx
function call_hide_show(id, q, page, item_id, flag, open){
	open  = open  || true;
	if  (id && q && page*1 && item_id*1){
		oktoGET.init(window.location.hash);
		mas_hash = oktoGET.getParams();
		IDx.init(mas_hash['id']);
		if (flag){
			if (open){IDx.del_value(item_id);};
		} else {
			IDx.push(item_id);
		}
		mas_hash = {'path':id, 'q':q, 'page':page, 'id':IDx.get_str()};
		new_mas_hash = oktoGET.setParams(mas_hash);
		window.location.hash = new_mas_hash;
	}
	return;
}



function nav_main_menu(id){
	go_to(id, function(){
		oktoGET.init(window.location.hash);
		mas_hash = oktoGET.getParams();
		mas_hash['path'] = id;
		new_mas_hash = oktoGET.setParams(mas_hash);
		window.location.hash = new_mas_hash;
		active_url();
	});
	return false;
}

function nav_catalog(id, q, page){
	if  (id && q && page*1){
		load_catalog(q, page, function(){
			IDx.clean();
			window.location.hash = oktoGET.setParams({'path':id, 'q':q, 'page':page, 'id':''});
			active_url();
		});
	}
	return false;
}

function nav_catalog_item(id, q, page, item_id, flag){
	flag  = flag  || true;
	if  (id && q && page*1 && item_id*1){
		load_item_catalog(id, q, page, item_id, flag);
		active_url();
	}
	return false;
}

function nav_load(){
	active_url();
	oktoGET.init(window.location.hash);
	var mas_hash = oktoGET.getParams();
	var path = mas_hash['path'];
	var q = mas_hash['q'];
	var page = mas_hash['page'];
	if (path){
		if (q && page*1){
			load_catalog(q, page, function(){
				IDx.init(mas_hash['id']);
				if(IDx.size()){
					for(var i=0; i<IDx.size(); ++i){
						var item_id = IDx.get_mas()[i];
						if(!$('#tr_'+item_id).next("tr").is(':visible')) {
							$('#tr_'+item_id).next("tr").slideDown();
						};
					}
					go_to('#tr_'+IDx.get_mas()[0], function(){});
					return;
				}
			})
		};
		go_to(path, function(){});
	}
	return;
}

function active_url(){
	oktoGET.init(window.location.hash);
	var mas_hash = oktoGET.getParams();
	var path = mas_hash['path'];
	var q = mas_hash['q'];
	var page = mas_hash['page'];
	$('#tmenu li').each(function(indx){
		$(this).removeClass('current_page_item');
	});
	if (path){
			$('#tmenu li a[href*="'+path+'"]').parent('li').addClass('current_page_item');
		}else{
			$('#tmenu li:first-child').addClass('current_page_item');
		};
	$('#filter a').each(function(indx){
		$(this).removeClass('current_page_item');
	});	
	if (q && page){
		$('#filter a[href*="?q='+q+'&page='+1+'"]').addClass('current_page_item');
	}else{
		$('#filter a:first-child').addClass('current_page_item');
	};
	
}
