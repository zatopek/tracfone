var smartPadActiveX = getSmartPadActiveX();

//ActiveX register by default 10 shortcuts, one for Agent Notes (CTRL+0) 
//and 9 for smart pad rows (CTRL+<n>, CTRL+ALT+<n>)
//I need to cancel these defaults since shortcuts no longer belogn to rows. 
cancelOldDefaults();

function getSmartPadActiveX(){    
	$W().loadSmartPadActiveX();    
	return $W().document.getElementById('smartPadActiveX');
}

function registerPasteShortcut(index, keyCode, alt, shift ,ctrl , win){
	//Always unregistering existing shortcut
	unRegisterPasteShortcut(index);
	
	smartPadActiveX.RegisterKeySequence(index2cellId(index), true, getKeyCode(keyCode), alt, shift ,ctrl , win, true, false);			
}

function registerStoreShortcut(index, keyCode, alt, shift ,ctrl , win){
	//Always unregistering existing shortcut
	unRegisterStoreShortcut(index);
	
	smartPadActiveX.RegisterKeySequence(index2cellId(index), false, getKeyCode(keyCode), alt, shift ,ctrl , win, true, false);			
}

function unRegisterPasteShortcut(index){
	smartPadActiveX.RegisterKeySequence(index2cellId(index), true, getKeyCode('0'), false, false ,false , false, false, true);			
}

function unRegisterStoreShortcut(index){
	smartPadActiveX.RegisterKeySequence(index2cellId(index), false, getKeyCode('0'), false, false ,false , false, false, true);			
}

//Functions used to register/unregister Agent Disposition portlet shortcuts 
function registerAgentDispositionPasteShortcut(){
	//CTRL+0
	if(!window.portletRemoved){
		unRegisterAgentDispositionPasteShortcut();
		smartPadActiveX.RegisterKeySequence(index2cellId(AGENT_DISPOSITION_PORTLET), true, getKeyCode('0'), false, false ,true , false, true, false);
	}			
}

function registerAgentDispositionStoreShortcut(){
	//CTRL+ALT+0
	if(!window.portletRemoved){
		unRegisterAgentDispositionStoreShortcut();
		smartPadActiveX.RegisterKeySequence(index2cellId(AGENT_DISPOSITION_PORTLET), false, getKeyCode('0'), true, false ,true , false, true, false);
	}			
}

function unRegisterAgentDispositionPasteShortcut(){
	smartPadActiveX.RegisterKeySequence(index2cellId(AGENT_DISPOSITION_PORTLET), true, getKeyCode('0'), false, false ,false , false, false, true);			
}

function unRegisterAgentDispositionStoreShortcut(){
	smartPadActiveX.RegisterKeySequence(index2cellId(AGENT_DISPOSITION_PORTLET), false, getKeyCode('0'), false, false ,false , false, false, true);			
}

function updateEntryValue(index, value){
	smartPadActiveX.UpdateCellData(index2cellId(index), value);	
}

//ActiveX register by default 10 shortcuts, one for Agent Notes (CTRL+0) 
//and 9 for smart pad rows (CTRL+<n>, CTRL+ALT+<n>)
//I need to cancel these defaults since shortcuts no longer belogn to rows. 
function cancelOldDefaults(){
    for (iRow=1 ; iRow < 10 ; iRow++){
        smartPadActiveX.RegisterKeySequence(iRow , /*paste*/ true, 0, false, false, false, false, false/*active*/, true); 
        smartPadActiveX.RegisterKeySequence(iRow , /*store*/ false , 0, false, false, false, false, false/*active*/, true); 
    }
}

function clearAllEntriesShortcuts(){
	for(i = 1; i <= 250; i++){
		unRegisterPasteShortcut(i);
		unRegisterStoreShortcut(i);
	}
}

//converting cell Id to store index
function cellId2index(cellId){
	if(cellId == 0){
		return AGENT_DISPOSITION_PORTLET;
	}
	return cellId - 1;
}

//converting store index to cell Id
function index2cellId(index){
	if(index == AGENT_DISPOSITION_PORTLET){
		return 0;
	}
	return index + 1;
}

function jsPasteString(hwin1d, txt, cellId){
    if (txt != null && txt != ""){
		doStoreString(txt, cellId2index(cellId));	
	}
}

function getKeyCode(txt1){
	txt = txt1 + "";
	txt = txt.toUpperCase()
	
	val = -1;
	
	if (!txt || txt == "") {
		return 0;
	}

	if (txt.length == 1){
        switch (txt){
			case "+": 
				val = 187;
				break;
			case ",": 
				val = 188;
				break;
			case "-": 
				val = 189;
				break;
			case ".": 
				val = 190;
				break;		
            default:
        		val = txt.charCodeAt(0);
                break;            
        }
    }else{		        
		switch (txt){
			case "BACKSPACE": 
				val = 8;
				break;
			case "TAB": 
				val = 9;
				break;
			case "ENTER": 
				val = 13;
				break;
			case "ESC": 
				val = 27;
				break;
			case "SPACE": 
				val = 32;
				break;
			case "PAGE UP": 
				val = 33;
				break;
			case "PAGE DOWN": 
				val = 34;
				break;
			case "END": 
				val = 35;
				break;
			case "HOME": 
				val = 36;
				break;
			case "LEFTARROW": 
				val = 37;
				break;
			case "UPARROW": 
				val = 38;
				break;
			case "RIGHTARROW": 
				val = 39;
				break;
			case "DOWNARROW": 
				val = 40;
				break;
			case "INSERT": 
				val = 45;
				break;
			case "DELETE": 
				val = 46;
				break;
			case "NUMPAD 0": 
				val = 96;
				break;
			case "NUMPAD 1": 
				val = 97;
				break;
			case "NUMPAD 2": 
				val = 98;
				break;
			case "NUMPAD 3": 
				val = 99;
				break;
			case "NUMPAD 4": 
				val = 100;
				break;
			case "NUMPAD 5": 
				val = 101;
				break;
			case "NUMPAD 6": 
				val = 102;
				break;
			case "NUMPAD 7": 
				val = 103;
				break;
			case "NUMPAD 8": 
				val = 104;
				break;
			case "NUMPAD 9": 
				val = 105;
				break;
			case "NUMPAD *": 
				val = 106;
				break;
			case "NUMPAD +": 
				val = 107;
				break;
			case "NUMPAD -": 
				val = 109;
				break;
			case "NUMPAD ,": 
				val = 110;
				break;
			case "NUMPAD /": 
				val = 111;
				break;
			case "F1": 
				val = 112;
				break;
			case "F2": 
				val = 113;
				break;
			case "F3": 
				val = 114;
				break;
			case "F4": 
				val = 115;
				break;
			case "F5": 
				val = 116;
				break;
			case "F6": 
				val = 117;
				break;
			case "F7": 
				val = 118;
				break;
			case "F8": 
				val = 119;
				break;
			case "F9": 
				val = 120;
				break;
			case "F10": 
				val = 121;
				break;
			case "F11": 
				val = 122;
				break;
			case "F12": 
				val = 123;
				break;
			default : alert('Smart Pad: Unknown key: ' + txt1);
                      val = -1;
		} // switch
	} // if
	return val;		
}
