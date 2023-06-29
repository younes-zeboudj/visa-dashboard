async function get_success_bdl_files() {
  return new Promise((resolve, reject) => {
      $.get(`${window.appurl}/get_success_bdl_files`, data=>resolve(JSON.parse(data)))
  });
}


export { get_success_bdl_files };
