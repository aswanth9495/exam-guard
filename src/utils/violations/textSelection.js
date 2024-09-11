export default function preventTextSelection() {
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
}
