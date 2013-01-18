Ext.define('Lapidos.controller.response.Manager', {
	extend: 'Ext.util.Observable',
	
	config: {
		errors: [],
		errorsAssoc: {},
		messages: [],
		messagesAssoc: {},
		returnCode: {},
		redirect: '',
		sendPlainText: false,
		response: null
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
	},
	
	addError: function(message, fieldName) {
//		if (fieldName) {
//			if (Ext.isArray(message)) {
//				this._errors[] = new LP_Response_Message(message);
//				this._errorsAssoc[] = message;
//			}
//			else {
//				data = array(
//					'msg' => message
//				);
//				this._errors[] = new LP_Response_Message(data);
//				this._errorsAssoc[] = data;
//			}
//		}
//		else {
//			data = array(
//				'id' => fieldName,
//				'msg' => message,
//			);
//			this._errors[] = new LP_Response_Message(data);
//			this._errorsAssoc[] = data;
//		}
	},
	
	addMessage: function(message, fieldName) {
//		if (fieldName === false) {
//			if (is_array(message)) {
//				this._errors[] = message;
//				this._errorsAssoc[] = message.toArray();
//			}
//			else {
//				data = array(
//					'msg' => message
//				);
//				this._messages[] = new LP_Response_Message(data);
//				this._messagesAssoc[] = data['msg'];
//			}
//		}
//		else {
//			data = array(
//				'id' => fieldName,
//				'msg' => message,
//			);
//			this._messages[] = new LP_Response_Message(data);
//			this._messagesAssoc[] = message;
//		}
	},
	
	anyErrors: function() {
		if (this.getErrors().length) {
			return true;
		}
		else {
			return false;
		}
	},
	
	/**
	 * Returns true if there are no errors, false if any errors
	 * @return boolean
	 */
	noErrors: function() {
		if (this.getErrors().length) {
			return false;
		}
		else {
			return true;
		}
	},
	
	setParam: function(key, value) {
		var values = {};
		if (typeof key == 'string') {
			values[key] = value;
		}
		else {
			values = key;
		}
		for (var key in values) {
			this.getReturnCode()[key] = values[key];
		}
	},
	
	setHeaderData: function() {
		if (this.anyErrors()) {
			this.getReturnCode()['success'] = false;
		}
		else {
			this.getReturnCode()['success'] = true;
		}
		
		// build error string as list
		var errorStr = '<div class="form-messages form-errors"><ul>';
		var errors = this.getErrors();
		var numErrors = errors.length;
		for (var i = 0; i < numErrors; i++) {
			error = errors[i];
//			errorStr += '<li field="' . error.getId() . '">' . error.getMsg() . '</li>';
		}
		errorStr += '</ul></div>';
		
		// Build message string as list
		var msgStr = '';
		var messages = this.getMessages();
		var numMessages = messages.length;
		if (numMessages == 1) {
//			msgStr = messages[0].getMsg();
		}
		else if (numMessages > 1) {
			msgStr = '<div class="form-messages"><ul>';
			for (var i = 0; i < numMessages; i++) {
				message = messages[i];
//				msgStr .= '<li field="' . message.getId() . '">' . message.getMsg() . '</li>';
			}
			msgStr += '</ul></div>';
		}
		
		this.getReturnCode()['errors'] = this.getErrors(true);
		this.getReturnCode()['errorStr'] = errorStr;
		this.getReturnCode()['msg'] = this.getMessages(true);
		this.getReturnCode()['msgStr'] = msgStr;
		this.getReturnCode()['redirect'] = this.getRedirect();
	},
	
	sendHeaders: function() {
		this.setHeaderData();
        this.response.json(this.getReturnCode());
	},

    send404: function(content) {
        content = content || 'File not found';
        this.response.status(404).send(content);
    }
	
});
