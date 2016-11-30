
/*--------------------------------------------
 |              R E S O U R C E S             |
 ============================================*/
if (iNet.resources.ajaxLoading) {
  iNet.apply(iNet.resources.ajaxLoading, {
    del: 'Đang xóa dữ liệu ...',
    update: 'Đang cập nhật dữ liệu ...',
    save: 'Đang lưu dữ liệu ...',
    load: 'Đang tải dữ liệu ...',
    search: 'Đang tìm kiếm dữ liệu ...',
    status: 'Đang cập nhật trạng thái ...',
    add: 'Đang thêm dữ liệu ...',
    processing:'Đang xử lý ...',
    approving: 'Đang duyệt ...',
    submit: 'Đang trình duyệt ...',
    uploading: 'Đang tải tài liệu'
  });
}
if (iNet.resources.message) {
  iNet.apply(iNet.resources.message, {
    error_title: 'Lỗi',
    error: '<font color="red">Có lỗi khi thực hiện tác vụ.</font>',
    emptyMsg: 'Không có dữ liệu để hiển thị',
    emptyReason: 'Không có lý do để hiển thị',
    emptyContent: 'Không có nội dung để hiện thị',
    emptyMsgAttach: 'Không có tài liệu đính kèm để hiển thị',
    save_error: '<div><b>Có {0} lỗi ngăn không cho lưu dữ liệu này</b></div>',
    update_error: '<div><b>Có {0} lỗi ngăn không cho cập nhật dữ liệu này</b></div>',
    search_error: '<div><b>Có {0} lỗi ngăn không cho tìm kiếm dữ liệu này</b></div>',
    required: 'Bắt buộc nhập các trường có dấu (<span class="required">*</span>)',
    no_results_text:'Không tìm thấy dữ liệu'
  });
}
if (iNet.resources.message.button) {
  iNet.apply(iNet.resources.message.button, {
    save: 'Lưu',
    update: 'Cập nhật',
    create: 'Tạo mới',
    close: 'Đóng',
    ok: 'Đồng ý',
    cancel: 'Hủy bỏ',
    edit: 'Sửa đổi',
    lock: 'Khóa',
    unlock: 'Mở khóa',
    del: 'Xóa',
    test: 'Kiểm tra',
    exit: 'Thoát',
    back: 'Trở lại',
    sync: 'Đồng bộ',
    view: 'Xem',
    skip: 'Bỏ qua',
    disable: 'Không hiệu lực',
    available: 'Hiệu lực',
    view_update: 'Xem và cập nhật',
    print: 'In phiếu',
    download: 'Tải về',
    update_exit: 'Cập nhật và đóng',
    save_exit: 'Lưu và đóng',
    add: 'Thêm',
    approve: 'Duyệt',
    reject: 'Từ chối',
    finish: 'Hoàn tất',
    next: 'Tiếp theo',
    back: 'Quay lại',
    info: 'Thông tin chi tiết'
  });
}
if (iNet.resources.plugins.confirm) {
  iNet.apply(iNet.resources.plugins.confirm, {
    ok: 'Đồng ý',
    cancel: 'Bỏ qua',
    title: 'Tiêu đề',
    content: 'Nội dung'
  });
}
if (iNet.resources.plugins.selectService) {
  iNet.apply(iNet.resources.plugins.select2Service, {
    choose: 'Chọn 1 giá trị',
    no_matches_found:'Không tìm thấy dữ liệu',
    searching: 'Đang tìm kiếm...',
    please_enter:'Vui lòng nhập',
    more_char:' nhiều ký tự',
    only_select: 'Bạn chỉ có thể chọn',
    load_more: 'Đang tải dử liệu...',
    item: 'Giá trị'
  });
}
if (iNet.resources.register) {
  iNet.apply(iNet.resources.register, {
    is_number: 'Phải là số',
    is_email: 'Email chưa đúng',
    not_year: 'Năm không đúng',
    not_date: 'Ngày không đúng',
    do_not_agree: '<p class="error">Bạn chưa đồng ý với các điều khoản của iNet Solutions Corp.,</p>',
    field_empty: '<p class="error">Bạn chưa điền đầy đủ các thông tin bên dưới</p>',
    truth_captcha: 'Mã xác nhận không đúng',
    create_acc_success: '<p class="success">Tạo tài khoản thành công!</p>',
    pass_not_strength: '<p class="error">Mã an toàn chưa đủ mạnh. Vui lòng nhập lại!</p>',
    check_email: '<p class="success">Vui lòng kiểm tra thông tin tài khoản email!</p>',
    active_email: '<p class="success">Vui lòng kiểm tra và kích hoạt email!</p>',
    exist_domain: 'Tên miền đã tồn tại',
    available_domain: 'Bạn có thể sử dụng tên miền này',
    domain_empty: 'Bạn chưa nhập tên miền'
  });
}