/**
 * @class
 * LoggerLevel class<br>
 * Use one of this levels when calling the setLevel method<br>
 *  <br>- LoggerLevel.OFF
 *	<br>- LoggerLevel.NONE 
 *	<br>- LoggerLevel.FATAL 
 *	<br>- LoggerLevel.ERROR 
 *	<br>- LoggerLevel.WARN 
 *	<br>- LoggerLevel.INFO
 *	<br>- LoggerLevel.DEBUG
 *  <br>- LoggerLevel.TRACE
 *  <br>- LoggerLevel.ALL
 */
LoggerLevel = Class.create();
LoggerLevel.OFF     = { name :"off"     , level: 0 };
LoggerLevel.NONE    = { name :"none"    , level: 0 };
LoggerLevel.FATAL   = { name :"fatal"   , level: 10};
LoggerLevel.ERROR   = { name :"error"   , level: 20 };
LoggerLevel.WARN    = { name :"warn"    , level: 50 };
LoggerLevel.INFO    = { name :"info"    , level: 100 };
LoggerLevel.DEBUG   = { name :"debug"   , level: 1000 };
LoggerLevel.TRACE   = { name :"trace"   , level: 1500 };
LoggerLevel.ALL     = { name :"all"     , level: 2000 };

/**
 * @class
 * LogManagerImpl class<br>
 * The LogManager implementation
 * <br>
 * Usage: $W().LogManager.getLogger("MySpecificLogger").debug("my message");
 */
LogManagerImpl = Class.create();
LogManagerImpl.prototype = {

  initialize: function(level) {
     if (arguments.length == 1) {
        this.threshold=arguments[0];
     } else {
        this.threshold=LoggerLevel.Error;
     }
     
     this.loggers = [];
  },
  
  /**
   * Retrieves a Logger
   * @param {} loggerName - the logger identified by this name
   */
  getLogger: function(loggerName) {
    if (this.loggers[loggerName] == null) {
        this.loggers[loggerName] = new Logger(loggerName, this.threshold);
    }
    return this.loggers[loggerName];
  },
  
  /**
   * Change the current log level
   * @param {} level - the log level to set
   */
  setLevel: function(level) {
     this.threshold=level;
  },
  
  /**
   * Show the console window
   */  
  showConsole: function() {
      this.console = window.open("SYSTEM/resources/jsp/console.jsp", "_blank", "width=300, height=200, resizable=1, scrollbars=1, status=0, menubar=0, location=0, toolbar=0  ", false);
  },
  
  /**
   * Hide the console window
   */
  hideConsole: function() {
     this.console.close();
     this.console = null;
  },
  
  _logToConsole: function(level, message) {
     if(typeof window.console != 'undefined') {
        console.log(message);
     }
  }
}

var LogManager = new LogManagerImpl();

/**
 * @class
 * Logger class<br>
 */ 
Logger = Class.create();
Logger.prototype = {
  initialize: function(loggerName, level) {
      this.loggerName = loggerName;
      this.threshold = level;
  },
  
  _log: function(level,message) {
     LogManager._logToConsole(level, message);

     if (this.threshold.level == LoggerLevel.NONE.level) {
        return;
     }
     
     if (level.level > this.threshold.level) {
        return;
     }

     try {
    
         var pars = "loggerName=" + this.loggerName + "&level="+level.name+"&message="+encodeURIComponent(message);
         this.request = new Ajax.Request("SYSTEM/resources/jsp/clientLogger.jsp",
                    {method: 'get', parameters: pars } );
     } catch (e) {}                

  },
  
 /**
 * writes a message if in fatal mode
 * @param message - the message to log
 */
  fatal: function(message) {
     this._log(LoggerLevel.FATAL,message);
  },

 /**
 * writes a message if in error mode
 * @param message - the message to log
 */
  error: function(message) {
     this._log(LoggerLevel.ERROR,message);
  },

 /**
 * writes a message if in warning mode
 * @param message - the message to log
 */
  warning: function(message) {
     this._log(LoggerLevel.WARN,message);
  },

 /**
 * writes a message if in info mode
 * @param message - the message to log
 */
  info: function(message) {
     this._log(LoggerLevel.INFO,message);
  },

 /**
 * writes a message if in debug mode
 * @param message - the message to log
 */
  debug: function(message) {
     this._log(LoggerLevel.DEBUG,message);
  },

 /**
 * writes a message if in trace mode
 * @param message - the message to log
 */
  trace: function(message) {
     this._log(LoggerLevel.TRACE,message);
  }


}

