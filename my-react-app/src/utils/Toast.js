import Swal from "sweetalert2";
import { notification } from "antd";
/**
 *
 * @param {*} message
 */
export const showSuccess = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: message,
  });
};

/**
 *
 * @param {*} message
 */
export const showError = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    width: 350,
  });

  Toast.fire({
    icon: "error",
    title: message,
  });
};

export function Notification(type, title, description) {
  notification[type]({
    message: title,
    description: description,
    top: 100,
  });
}

/**
 *
 * @param {*} message
 */
export const confirmBox = async (message,confirmText,cancelText) => {
  return await new Promise(function (resolve) {
    const Toast = Swal.mixin({
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'mx-3 btn btn-success',
        // confirmButton: confirmText === ("Active" || "Yes") ? 'mx-3 btn btn-success' : 'mx-3 btn btn-danger',
      },
      buttonsStyling: false
    })

    Toast.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: cancelText,
      confirmButtonText: confirmText,
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        resolve(false);
      }
    })
  });
};