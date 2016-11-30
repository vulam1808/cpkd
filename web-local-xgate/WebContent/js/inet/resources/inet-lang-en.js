
/*--------------------------------------------
 |              R E S O U R C E S             |
 ============================================*/
if (iNet.resources.ajaxLoading) {
  iNet.apply(iNet.resources.ajaxLoading, {
    del: 'Deleting data ...',
    update: 'Updating data ...',
    save: 'Saving data ...',
    load: 'Loading data ...',
    search: 'Searching data ...',
    status: 'updating status ...',
    add: 'Adding data ...',
    processing: 'Processing ...',
    approving: 'approving ...',
    submit: 'Submitting ...',
    uploading: 'UpLoading'
  });
}
if (iNet.resources.message) {
  iNet.apply(iNet.resources.message, {
    error_title: 'Error',
    error: '<font color="red">There were error when action.</font>',
    emptyMsg: 'No data to display',
    emptyReason: 'No reason to display',
    emptyContent: 'No content to display',
    emptyMsgAttach: 'No attachment to display',
    save_error: '<div><b>{0} errors prohibited this issue from being saved</b></div>',
    update_error: '<div><b>{0} errors prohibited this issue from being updated</b></div>',
    search_error: '<div><b>{0} errors prohibited this issue from being deleted</b></div>',
    required: 'Required not blank in the location with (<span class="required">*</span>)',
    no_results_text:'no results text'
  });
}
if (iNet.resources.message.button) {
  iNet.apply(iNet.resources.message.button, {
    save: 'Save',
    update: 'Update',
    create: 'Create',
    close: 'Close',
    ok: 'OK',
    cancel: 'Cancel',
    edit: 'Edit',
    lock: 'Lock',
    unlock: 'Unlock',
    del: 'Delete',
    test: 'Test',
    exit: 'Exit',
		back: 'Back',
    sync: 'sync',
    view: 'view',
    skip: 'Skip',
    disable: 'Disable',
    available: 'Available',
    view_update: 'View and update',
    print: 'Print',
    download: 'Download',
    update_exit : 'Update and close',
    save_exit: 'Save and close',
    add: 'Add',
    approve: 'Approve',
    reject: 'Reject',
    finish: 'Finish',
    next:'Next',
    back:'Back',
    info:'view information'
  });
}
if (iNet.resources.plugins.confirm) {
  iNet.apply(iNet.resources.plugins.confirm, {
    ok: 'OK',
    cancel: 'Cancel',
    title: 'Title',
    content: 'Content'
  });
}

if (iNet.resources.plugins.selectService) {
  iNet.apply(iNet.resources.plugins.selectService, {
    choose: 'Select a State',
    no_matches_found: 'No matches found',
    searching: 'Searching...',
    please_enter: 'Please enter ',
    more_char: ' more characters',
    only_select: 'You can only select ',
    load_more: 'Loading more results...',
    item: ' items'
  });
}
if (iNet.resources.register) {
  iNet.apply(iNet.resources.register, {
    is_number: 'Must number',
    is_email: 'Email not match',
    not_year: 'Year not match',
    not_date: 'Day not match',
    do_not_agree: '<p class="error">You must agree to iNet Solutions\'s Terms of Service</p>',
    field_empty: '<p class="error">You not yet fill full range of information</p>',
    truth_captcha: 'Captcha not match',
    create_acc_success: '<p class="success">Create account successfully!</p>',
    pass_not_strength: '<p class="error">Security code is not strength. Please re-enter!</p>',
    check_email: '<p class="success">Please check the email account information!</p>',
    active_email: '<p class="success">Please check and activation the email!</p>',
    exist_domain: 'Domain name already exists',
    available_domain: 'Domain name available',
    domain_empty: 'Domain name not empty'
  });
}