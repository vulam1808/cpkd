if (iNet.resources.ibook.admin.dict.globalBank) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalBank, {
    dialog_confirm_title : 'Xóa',
    dialog_confirm_content : 'Bạn có đồng ý xóa dữ liệu đã chọn không ?',
    code_field : 'Mã',
    name_field : 'Tên',
    branch_field : 'Chi nhánh',
    address_field : 'Địa chỉ'
  });
}
if (iNet.resources.ibook.admin.dict.globalBusTypeCode) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalBusTypeCode, {
    code: 'Mã',
    name: 'Tên',
    name_not_blank: 'Tên không được để trống',
    code_not_blank: 'Mã không được để trống',
    code_gr_0: 'Mã phải lớn hơn 0',
    create: 'Tạo danh mục loại thuộc tính',
    update: 'Cập nhật danh mục loại thuộc tính',
    del_title: 'Xóa thuộc tính loại hàng hóa',
    del_content: 'Bạn có đồng ý xóa thuộc tính <b>{0}</b> đã chọn không ?'
  });
}
if (iNet.resources.ibook.admin.dict.globalStorage) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalStorage, {
    'ibook.storage.none': '',
    'ibook.storage.main': 'Là kho chính',
    del_title: 'Xóa thuộc tính kho',
    del_content: 'Bạn có chắc chắn xóa thuộc tính  <b>{0}</b> đã chọn không?',
    code: 'Mã',
    name: 'Tên',
    name_not_blank: 'Tên không được để trống',
    create_title: 'Tạo danh mục thuộc tính kho Global',
    update_title: 'Cập nhật danh mục thuộc tính kho Global'
  });
}
if (iNet.resources.ibook.admin.dict.globalTax) {
  iNet.apply(iNet.resources.ibook.admin.dict.globalTax, {
    'ibook.tax.invat': 'Thuế đầu vào',
    'ibook.tax.outvat': 'Thuế đầu ra',
    del_title: 'Xóa danh mục mức thuế',
    del_content: 'Bạn có chắc chắn xóa danh mục thuế  <b>{0}</b> đã chọn không?',
    code: 'Mã',
    name: 'Tên',
    value: 'Mức thuế',
    type: 'Loại thuế',
    code_not_blank: 'Mã không được để trống',
    name_not_blank: 'Tên không được để trống',
    value_gr_0: 'Mức thuế phải lớn hơn 0',
    create_title: 'Tạo danh mục mức thuế Global',
    update_title: 'Cập nhật danh mục mức thuế Global'
  });
}