export function onlyNumber(e: any) {
  const keyCode = e.keyCode ? e.keyCode : e.which
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    e.preventDefault()
  }
  if (keyCode === 46 && String(e.target.value).includes('.')) {
    e.preventDefault()
  }
}
