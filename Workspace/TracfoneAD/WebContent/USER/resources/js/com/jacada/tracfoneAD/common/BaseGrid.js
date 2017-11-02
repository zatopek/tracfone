//var bColor = "#f5f5f5";
var bColor = "rgb(214,214,214)";

Ext.define('Jacada.grid.BaseGrid', {
    extend: 'Ext.grid.Panel',
    stripeRows: true,
    viewConfig: {
        forceFit: true
    },
    autoScroll: true,
    width: '80%',
    height:'100px',
    loadMask: true,
    loadData: function (data) {
        if(data){
            data = this.root ? getData(this.root, data) : data;
            this.getStore().loadData(data);
        }else{
            this.add({html:'No data received for this session.' });
        }
    }
});

Ext.define('Jacada.panel.BasePanel', {
    extend: 'Ext.panel.Panel',
    frame: true,
    collapsible: true,
    width: '100%',
    layout: 'vbox',
    bodyStyle: 'background-color:' + bColor,
    loadData: function (data) {
        if(data){
            var rootData = this.root ? getData(this.root, data) : data;

            if(!rootData || (rootData.status && rootData.status !== 'success')){
                this.items.each(function(item){ item.destroy(); });
                this.add({html:'Error. ' + (rootData.message ? 'Description: ' + rootData.message : '')});
                return;
            }

            this.items.each(function (item) {

                if (item.dataView) {
                    var itemData = item.root ? getData(item.root, rootData) : rootData;
                    applyDataForm(item, itemData);
                } else {
                    item.loadData(rootData);
                }
            });
        }else{
            this.add({html:'No data received for this session.' });
        }

    }
});

Ext.define('Jacada.panel.GridWrapper', {
    extend: 'Jacada.panel.BasePanel',
    alias: 'widget.gridWrapper',
    maxHeight: 310,
    layout: 'fit',
    width: '70%',
    defaults:{
        width: '70%'
    }
});

function applyDataForm(element, data) {
    if(data){
        element.items.each(
            function (item) {
                if (item.cls === 'ah-widget-data' || item.cls === 'ah-widget-data-left') {
                    var id = item.id.indexOf('_') >= 0 ? item.id.replace('_', '') : item.id;  //turn around for fields with same id (set one of them to _id)
                    var value = data[id];
                    value = (value && data[id].trim()) ? value : '-';
                    item.update(value);
                }
            });
    }else{
        element.add({html:'No data received for this session.' });
    }
}

function getData(root, data) {
    Ext.each(root.split('.'), function(subRoot) {
        data = data[subRoot];
    });
    return data;
}


