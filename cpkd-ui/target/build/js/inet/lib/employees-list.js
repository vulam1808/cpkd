// #PACKAGE: employees-list
// #MODULE: EmployeesListWidget
/**
 * Created by ntvy on 4/22/15.
 */
$(function() {
  iNet.ns("iNet.ui", "iNet.ui.helloworld");
  iNet.ui.helloworld.EmployeesListWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    this.id = this.id || 'employees-widget';

    iNet.ui.helloworld.EmployeesListWidget.superclass.constructor.call(this);

    var me= this;
    var dataSource = new iNet.ui.grid.DataSource({
      columns : [{
        type : 'selection',
        align: 'center',
        width : 30
      },{
        property : 'order',
        label :'Order',
        type : 'rownumber',
        align: 'center',
        width : 100
      },{
        property : 'name',
        label : 'Name',
        sortable : true,
        type : 'text',
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Name must not be empty';
        }
      },{
        property : 'fullname',
        label : 'Full Name',
        sortable : true,
        type : 'text',
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'FullName must not be empty';
        }
      },{
        property : 'email',
        label : 'Email',
        sortable : true,
        type : 'text',
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'FullName must not be empty';
          if (!iNet.isEmail(v))
            return 'Email invalid';
        }
      },{
        label : '',
        type : 'action',
        separate: '&nbsp;',
        align: 'center',
        cls: 'hidden-767',
        buttons : [{
          text : 'Edit',
          icon : 'icon-pencil',
          labelCls: 'label label-info',
          fn : function(record) {
            console.log(record);
            me.getGrid().edit(record[me.getGrid().getIdProperty()]);
          }
        },{
          text : 'Delete',
          icon : 'icon-trash',
          labelCls: 'label label-important',
          fn : function(record) {
            me.getGrid().remove(record[me.getGrid().getIdProperty()]);
          }
        }]
      }]
    });

    this.grid = new iNet.ui.grid.Grid({
      id : 'employees-grid',
      dataSource : dataSource,
      url: '',
      firstLoad: false,
      idProperty : 'uuid',
      pageSize: 10,
      data: this.generateData(100)
    });

    this.grid.on('save', function(data) {
      var __data = data || {};
      console.log('saved>>', __data);
      this.getGrid().insert(__data);
      this.getGrid().newRecord();
    }.createDelegate(this));

    this.grid.on('update', function(data, odata) {
      var __data = data || {};

      console.log('updated>>', __data);
      this.getGrid().update(__data);
      this.getGrid().commit();
    }.createDelegate(this));

   this. grid.on('selectionchange', function(sm, data){
      console.log('selectionchange>>', sm, data);
    });

    $('#employees-btn-add').on('click', function(){
      this.grid.newRecord();
    }.createDelegate(this));

    $('#employees-btn-add-office').on('click', function(){
      this.fireEvent('addoffice', this);
    }.createDelegate(this));

    $('#employees-btn-add-dialog').on('click', function(){
      this.fireEvent('adddialog', this);
    }.createDelegate(this));
  };
  iNet.extend(iNet.ui.helloworld.EmployeesListWidget, iNet.ui.Widget, {
    getGrid: function(){
      return this.grid;
    },
    random:  function(items){
      var __items= items ||[];
      return __items[Math.floor(Math.random() * __items.length)];
    },
    generateData: function(number){
      var total = number || 100;
      var items = [];
      var emails= ["Apple", "Google", "Microsoft", "Amazon", "iNet Solutions", "Samsung", "Sony", "Nokia" , "HTC"];
      var names= ["Java", "jQuery", "Python", "MongoDB", "Css", "Html5", "NodeJs", "MySql" ,"Extjs", "C++"];
      var products= ["iDesk", "MacBook", "Ipad", "Galaxy", "Gmail", "iMail", "Window", "iPhone" ,"Lumina"];
      for(var i=0; i<total; i++) {
        items.push({
          uuid: iNet.generateId(),
          name: this.random(names),
          fullname: this.random(products),
          email: (this.random(names) + '@' + this.random(emails) + '.com').toLowerCase()
        });
      }
      return items;
    }
  });

});