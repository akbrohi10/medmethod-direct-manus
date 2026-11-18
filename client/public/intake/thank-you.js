/* Thank-you only. Contact stays in memory, never in URLs/storage/events. */
(function(window,document){
 'use strict';
 var query=new URLSearchParams(window.location.search),receipt=null,phone='',revision=0,correcting=false,pendingEdit=null,blockedEdit=false;
 if(window.MmdMetaLead&&window.MmdMetaLead.consumeIntakeThankYou)window.MmdMetaLead.consumeIntakeThankYou();
 var names=['ty_phone_corrected','ty_video_yes','ty_video_no','ty_option_single','ty_continue_payment','ty_screen_default','ty_screen_phone_edit','ty_screen_video_1','ty_screen_video_2','ty_screen_no_thanks','ty_screen_payment'];
 function el(id){return document.getElementById(id)}
 function excluded(){if(!receipt||receipt.is_test||window.self!==window.top)return true;if(['prefill','preview','demo','test','is_test','admin','qa'].some(function(k){return query.has(k)}))return true;try{return window.sessionStorage.getItem('mmd_meta_session_excluded_v1')==='1'}catch(_){return true}}
 function event(name){if(names.indexOf(name)<0||excluded())return;if(window.MmdIntakeNeutralEvents)window.MmdIntakeNeutralEvents.emit(name,receipt.is_test)}
 function digits(value){var d=String(value||'').replace(/\D/g,'');return d.length===11&&d[0]==='1'?d.slice(1):d}
 function format(value){var d=digits(value).slice(0,10);return !d?'':d.length<4?'('+d:'('+d.slice(0,3)+') '+d.slice(3,6)+(d.length>6?'-'+d.slice(6):'')}
 function valid(value){var raw=String(value||'').trim(),compact=raw.replace(/[\s().-]/g,'');return /^[\d\s().+-]+$/.test(raw)&&/^(?:\+?1)?[2-9]\d{2}[2-9]\d{6}$/.test(compact)}
 function view(step,scroll){el('ty-video-step1').hidden=step!=='one';el('ty-video-step2').hidden=step!=='two';el('ty-video-declined').hidden=step!=='no';event(step==='one'?'ty_screen_video_1':step==='two'?'ty_screen_video_2':'ty_screen_no_thanks');if(scroll)el('video-visit-card').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
 function error(message){el('ty-phone-error').textContent=message;el('ty-phone-error').hidden=!message;el('ty-phone-input').setAttribute('aria-invalid',message?'true':'false')}
 function delay(ms){return new Promise(function(resolve){window.setTimeout(resolve,ms)})}
 async function request(path,body){var response=await window.fetch(path,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','X-MMD-Intake-Contact':'1'},credentials:'same-origin',body:JSON.stringify(body)});var data={};try{data=await response.json()}catch(_){}if(!response.ok){var failure=new Error('Phone request unavailable.');failure.result=data;throw failure}return data}
 function confirmation(){return request('/api/intake/confirmation',{submission_token:receipt.submission_token})}
 function assign(data){if(!valid(data.phone)||!Number.isInteger(data.revision)||data.revision<0||['original','pending','updated','failed'].indexOf(data.status)<0)throw new Error('Invalid confirmation.');phone=data.phone;revision=data.revision;return data}
 function display(updated){el('ty-phone-display').textContent=(updated?"Updated – we'll text you at ":"We'll text you at ")+format(phone);el('ty-edit-phone').hidden=blockedEdit}
 async function poll(){var data;for(var i=0;i<30;i++){await delay(1000);data=assign(await confirmation());if(data.status!=='pending')return data}var pending=new Error('Still pending.');pending.pending=true;throw pending}
 async function loadPhone(){var data;for(var i=0;i<4;i++){try{data=assign(await confirmation());break}catch(_){if(i<3)await delay(500*(i+1))}}
  if(!data){el('ty-phone-display').textContent='Need to confirm or change your number? Call our Care Team at (888) 362-7011.';el('ty-edit-phone').hidden=true;return}
  if(data.status==='pending'){blockedEdit=true;el('ty-phone-display').textContent='Your phone update is still being confirmed. Refresh to check, or call our Care Team at (888) 362-7011.';el('ty-edit-phone').hidden=true;return}
  if(data.status==='failed'){blockedEdit=true;el('ty-phone-display').textContent='Your phone update needs help from our Care Team. Please call (888) 362-7011.';el('ty-edit-phone').hidden=true;return}display(false)
 }
 async function save(e){e.preventDefault();if(correcting||blockedEdit)return;var raw=el('ty-phone-input').value;if(!valid(raw)){error('Please enter a valid US mobile number.');el('ty-phone-input').focus();return}var next='+1'+digits(raw);if(next===phone){el('ty-phone-form').hidden=true;display(false);return}
  if(!pendingEdit||pendingEdit.phone!==next)pendingEdit={phone:next,id:window.crypto.randomUUID(),revision:revision};correcting=true;el('ty-save-phone').disabled=true;el('ty-phone-input').readOnly=true;el('ty-cancel-phone').disabled=true;el('ty-save-phone').textContent='Saving…';error('');
  try{var data=assign(await request('/api/intake/phone/correct',{submission_token:receipt.submission_token,new_phone:pendingEdit.phone,request_id:pendingEdit.id,expected_revision:pendingEdit.revision}));if(data.status==='pending'){blockedEdit=true;el('ty-save-phone').textContent='Confirming…';data=await poll()}
   if(data.status!=='updated'||data.phone!==pendingEdit.phone)throw new Error('Correction not acknowledged.');blockedEdit=false;display(true);el('ty-phone-form').hidden=true;pendingEdit=null;event('ty_phone_corrected')
  }catch(failure){var data=failure.result;if(data&&data.status==='failed')blockedEdit=true;error(failure.pending?'Your update is still being confirmed. Refresh to check, or call our Care Team at (888) 362-7011.':'We couldn’t confirm your number update. Please try again, or call us at (888) 362-7011.');el('ty-edit-phone').hidden=blockedEdit}
  finally{correcting=false;el('ty-save-phone').disabled=blockedEdit;el('ty-phone-input').readOnly=blockedEdit;el('ty-cancel-phone').disabled=false;el('ty-save-phone').textContent=blockedEdit?'Awaiting confirmation':'Save'}
 }
 function initialize(value){receipt=value;var paidMessage=el('ty-text-payment-received');if(paidMessage)paidMessage.hidden=!(receipt.payment_status==='COMPLETED'&&receipt.payment_provider==='paypal'&&receipt.amount==='29.00');event('ty_screen_default');view(query.get('video')==='1'?'two':'one',false);if(query.get('video')==='1')event('ty_option_single');el('ty-video-yes').onclick=function(){event('ty_video_yes');event('ty_option_single');view('two',true)};el('ty-video-no').onclick=function(){event('ty_video_no');view('no',false)};el('ty-video-back').onclick=function(){view('one',false)};el('ty-video-change').onclick=function(){view('one',false)};el('ty-offer-single').onchange=function(){event('ty_option_single')};
  el('ty-edit-phone').onclick=function(){if(blockedEdit)return;el('ty-phone-input').value=format(phone);el('ty-phone-form').hidden=false;el('ty-edit-phone').hidden=true;error('');event('ty_screen_phone_edit');el('ty-phone-input').focus()};el('ty-cancel-phone').onclick=function(){if(correcting)return;el('ty-phone-form').hidden=true;el('ty-edit-phone').hidden=blockedEdit;error('')};el('ty-phone-input').oninput=function(e){e.target.value=format(e.target.value);error('')};el('ty-phone-form').onsubmit=save;loadPhone()
 }
  function payment(){event('ty_continue_payment');event('ty_screen_payment');document.body.classList.add('ty-checkout-active')}
 window.MmdThankYou=Object.freeze({initialize:initialize,payment:payment,format:format,valid:valid,event:event});
})(window,document);
