/* No tracker installation. Forwarding stays OFF until vendor-supported clinical capture exclusion is verified. */
(function(window){
 'use strict';
 var ty=['ty_phone_corrected','ty_video_yes','ty_video_no','ty_option_single','ty_continue_payment','ty_screen_default','ty_screen_phone_edit','ty_screen_video_1','ty_screen_video_2','ty_screen_no_thanks','ty_screen_payment'];
 var printed=false;
 function emit(name,test){
  if(ty.indexOf(name)<0&&!/^intake_screen_(0[1-9]|[1-5][0-9]|60)$/.test(name))return false;
  var q=new URLSearchParams(window.location.search),blocked=test===true||window.self!==window.top||['prefill','preview','demo','test','is_test','admin','qa'].some(function(k){return q.has(k)});
  try{blocked=blocked||window.sessionStorage.getItem('mmd_meta_session_excluded_v1')==='1'}catch(_){blocked=true}
  if(blocked)return false;
  window.dispatchEvent(new CustomEvent('mmd-intake-neutral-event',{detail:Object.freeze({event:name})}));
  if(window.__mmdHotjarIntakeCaptureExcludedVerified===true&&typeof window.hj==='function'){window.hj('event',name);return true}
  if(!printed){printed=true;console.info('[MMD] Neutral intake events prepared; Hotjar forwarding is off pending privacy verification.')}
  return false;
 }
 function screen(id){var all=["w04", "w03", "w05", "w05details", "w04a", "w05a", "w05e", "w05g", "w06d", "w07", "w08", "w09", "w10", "w11", "w13", "w14", "w15", "w16", "w23", "w24", "w25", "w26", "w27", "w28", "w29", "w31", "w33", "w34", "w30", "wShippingAddress", "wScalePhoto", "w38", "wSignForms", "w01", "w02"];var index=all.indexOf(id);return index<0?null:'intake_screen_'+String(index+1).padStart(2,'0')}
 window.MmdIntakeNeutralEvents=Object.freeze({emit:emit,screen:screen});
})(window);
