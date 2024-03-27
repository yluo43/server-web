export default {
    bind(el, bindings) {
        const permissions = JSON.parse(localStorage.getItem('buttons') || '')
        // const permissions = ['add', 'edit']
        const needPermission = bindings.value
        const hasPermission = permissions.includes(needPermission)
        if (!hasPermission) {
            el.style.display = 'none'
            setTimeout(() => {
                el.parentNode.removeChild(el)
            }, 0)
        }
    }
}
