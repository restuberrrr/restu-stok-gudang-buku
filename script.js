import { supabaseRequest } from './supabase.js';

const state = {
  books: [],
  query: '',
};

const form = document.querySelector('#bookForm');
const fields = ['bookId', 'title', 'category', 'shelf', 'stock'].reduce((acc, id) => ({ ...acc, [id]: document.querySelector(`#${id}`) }), {});
const table = 'portfolio_books';

async function loadBooks() {
  state.books = await supabaseRequest(table);
  renderBooks();
}

function renderStats() {
  const totalStock = state.books.reduce((sum, book) => sum + Number(book.stock), 0);
  const lowStock = state.books.filter((book) => book.stock <= 5).length;
  const categories = new Set(state.books.map((book) => book.category)).size;
  document.querySelector('#stats').innerHTML = [
    ['Judul', state.books.length],
    ['Total Stok', totalStock],
    ['Stok Rendah', lowStock],
    ['Kategori', categories],
  ]
    .map(([label, value]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`)
    .join('');
}

function renderBooks() {
  const query = state.query.toLowerCase();
  const rows = state.books
    .filter((book) => [book.title, book.category, book.shelf].some((value) => value.toLowerCase().includes(query)))
    .map(
      (book) => `<tr>
        <td>${book.title}</td>
        <td>${book.category}</td>
        <td>${book.shelf}</td>
        <td><strong>${book.stock}</strong></td>
        <td>
          <button class="small" data-action="in" data-id="${book.id}">+ Masuk</button>
          <button class="small ghost" data-action="out" data-id="${book.id}">- Keluar</button>
          <button class="small ghost" data-action="edit" data-id="${book.id}">Edit</button>
          <button class="small danger" data-action="delete" data-id="${book.id}">Hapus</button>
        </td>
      </tr>`,
    )
    .join('');
  document.querySelector('#bookRows').innerHTML = rows || '<tr><td colspan="5">Tidak ada data.</td></tr>';
  renderStats();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    id: fields.bookId.value,
    title: fields.title.value.trim(),
    category: fields.category.value.trim(),
    shelf: fields.shelf.value.trim(),
    stock: Number(fields.stock.value),
  };
  if (payload.id) {
    await supabaseRequest(table, { method: 'PATCH', id: payload.id, body: payload });
  } else {
    delete payload.id;
    await supabaseRequest(table, { method: 'POST', body: payload });
  }
  form.reset();
  fields.bookId.value = '';
  fields.stock.value = 1;
  loadBooks();
});

document.querySelector('#resetForm').addEventListener('click', () => {
  form.reset();
  fields.bookId.value = '';
  fields.stock.value = 1;
});

document.querySelector('#search').addEventListener('input', (event) => {
  state.query = event.target.value;
  renderBooks();
});

document.querySelector('#bookRows').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const book = state.books.find((item) => String(item.id) === button.dataset.id);
  if (!book) return;
  if (button.dataset.action === 'in' || button.dataset.action === 'out') {
    const nextStock = Math.max(0, Number(book.stock) + (button.dataset.action === 'in' ? 1 : -1));
    supabaseRequest(table, { method: 'PATCH', id: book.id, body: { stock: nextStock } }).then(loadBooks);
  }
  if (button.dataset.action === 'delete') {
    supabaseRequest(table, { method: 'DELETE', id: book.id }).then(loadBooks);
  }
  if (button.dataset.action === 'edit') {
    fields.bookId.value = book.id;
    fields.title.value = book.title;
    fields.category.value = book.category;
    fields.shelf.value = book.shelf;
    fields.stock.value = book.stock;
  }
});

loadBooks();
