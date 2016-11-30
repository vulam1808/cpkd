if (iNet.resources.ibook.admin.dict.globalBank) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalBank, {
    dialog_confirm_title : 'Delete',
    dialog_confirm_content : 'Are you sure you wan\'t to delete ?',
    code_field : 'Code',
    name_field : 'Name',
    branch_field : 'Branch',
    address_field : 'Address'
  });
}
if (iNet.resources.ibook.admin.dict.globalBusTypeCode) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalBusTypeCode, {
    code: 'Code',
    name: 'Name',
    name_not_blank: 'Name do not blank',
    code_not_blank: 'Code do not blank',
    code_gr_0: 'Code must greater than 0',
    create: 'Create global business type code',
    update: 'Cập nhật danh mục loại thuộc tính',
    del_title: 'Delete global business tyoe code',
    del_content: 'Are you sure delete global <b>{0}</b> was selected ?'
  });
}
if (iNet.resources.ibook.admin.dict.globalStorage) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalStorage, {
    'ibook.storage.none': '',
    'ibook.storage.main': 'Main',
    del_title: 'Delete global storage',
    del_content: 'Are you sure delete global <b>{0}</b> selected?',
    code: 'Code',
    name: 'Name',
    name_not_blank: 'Name do not blank',
    create_title: 'Create global storage',
    update_title: 'Update global storage'
  });
}
if (iNet.resources.ibook.admin.dict.globalTax) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalTax, {
    'ibook.tax.invat': 'Invat',
    'ibook.tax.outvat': 'Outvat',
    del_title: 'Delete global tax',
    del_content: 'Are you sure global tax  <b>{0}</b> was selected?',
    code: 'Code',
    name: 'Name',
    value: 'Value',
    type: 'Type',
    code_not_blank: 'Code do not blank',
    name_not_blank: 'Name do not blank',
    value_gr_0: 'Value must greater than 0',
    create_title: 'Create global tax Global',
    update_title: 'Update global tax Global'
  });
}