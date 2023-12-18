function n(e){const t=e.keyCode?e.keyCode:e.which;(t<48||t>57)&&t!==46&&e.preventDefault(),t===46&&String(e.target.value).includes(".")&&e.preventDefault()}export{n as o};
