/**
 * This component represents a dynamic grid panel. <br>
 * The idea in a dynamic grid panel is that the columns and fields are created in load time.
 * In order to support the dynamic panel the server side is expected to send all the meta data information as decribed in these links: <br>
 * http://extjs.com/deploy/dev/docs/?class=Ext.data.JsonReader.
 * 
 */
Ext.ux.DynamicGridPanel = Ext.extend(Ext.grid.GridPanel, {
	
  initComponent: function(){
    /**
     * Default configuration options.
     *
     * You are free to change the values or add/remove options.
     * The important point is to define a data store with JsonReader
     * without configuration and columns with empty array. We are going
     * to setup our reader with the metaData information returned by the server.
     * See http://extjs.com/deploy/dev/docs/?class=Ext.data.JsonReader for more
     * information how to configure your JsonReader with metaData.
     *
     * A data store with remoteSort = true displays strange behaviours such as
     * not to display arrows when you sort the data and inconsistent ASC, DESC option.
     * Any suggestions are welcome
     */
	var shouldRemoteSort = true;
	//handling the useRemoteSort property
	if (typeof (this.useRemoteSort) == "undefined" || this.useRemoteSort == false){
		shouldRemoteSort = false;
	}
	var myStore = new Ext.data.Store({
		    url: this.storeUrl,
			 root: 'records',
        	totalProperty: 'total',
			remoteSort:shouldRemoteSort,
		    reader: new Ext.data.JsonReader()
		  });
    var config = {
      viewConfig:{forceFit:true},//causes the column to fit the grid 
      //enableColLock: false,
      loadMask: true,
      border: false,
      stripeRows: true,
      ds: myStore,
      columns: []
    };

    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config);
	
	
	
	

    Ext.ux.DynamicGridPanel.superclass.initComponent.apply(this, arguments);
  },

  onRender: function(ct, position){
  	this.store.on('load', function(){
	//this.store.on('metachange', function() {
      /**
       * Thats the magic! <IMG class=wp-smiley alt=:) src="http://erhanabay.com/wp-includes/images/smilies/icon_smile.gif">
       *
       * JSON data returned from server has the column definitions
       */
      if(typeof(this.store.reader.jsonData.columns) === 'object') {
	      var columns = [];
	      /**
	       * Adding RowNumberer or setting selection model as CheckboxSelectionModel
	       * We need to add them before other columns to display first
	       */
	      if(this.rowNumberer) { columns.push(new Ext.grid.RowNumberer()); }
	      if(this.checkboxSelModel) { columns.push(new Ext.grid.CheckboxSelectionModel()); }
		var columnIndex = 0;
        Ext.each(this.store.reader.jsonData.columns, function(column){
			//if there is a customization function activate it
			if(typeof(this.customColumnHandler) == 'function' || this.customColumnHandler){
				this.customColumnHandler(column);
			}
          columns.push(column);
		  //after the column was added if there is a customization function activate it
			if(typeof(this.customCellHandler) == 'function' || this.customCellHandler){
				column.renderer = this.customCellHandler;//this.getColumnModel().setRenderer(columnIndex, this.customCellHandler);
			}
			columnIndex++;
        },this);

	      /**
	       * Setting column model configuration
	       */
	      this.getColumnModel().setConfig(columns,false);
      }
      /**
       * Unmasking grid
       */
      this.el.unmask();
    }, this);
    this.colModel.defaultSortable = true;
    Ext.ux.DynamicGridPanel.superclass.onRender.call(this, ct, position);

    /**
     * Grid is not masked for the first data load.
     * We are masking it while store is loading data
     */
    this.el.mask('Loading...');
	this.store.on('loadexception', function(){
		alert("loadexception, please check the arguments variable for more info");
	}, this);

    /**
     * And finally load the data from server!
     */
    //this.store.load();
  }
});