import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookservicesService } from '../../services/bookServices/bookservices.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css'],
})
export class CreateBookComponent implements OnInit {
  createBookForm: FormGroup;
  categories = [
    'romantique',
    'drole',
    'fantastique',
    'historique',
    'educatif',
    'aventure',
    'educative',
  ];
  coverFile: File | null = null;
  errorMessage: string = '';
  private readonly maxImageSizeMB = 2; // Maximum file size in MB

  constructor(private fb: FormBuilder, private bookService: BookservicesService) {
    this.createBookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      sujet: ['', Validators.required],
      category: ['', Validators.required],
      cover: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.createBookForm.controls;
  }

  // Handle file selection
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input?.files?.length) {
    const file = input.files[0];
    console.log('Selected file size:', file.size);  // Log the size
    const maxSizeInBytes = this.maxImageSizeMB * 1024 * 1024; // Convert MB to bytes

    if (file.size > maxSizeInBytes) {
      Swal.fire({
        icon: 'error',
        title: 'Taille du fichier trop grande',
        text: `La taille de l'image sélectionnée dépasse la limite de ${this.maxImageSizeMB} MB. Veuillez choisir un fichier plus petit.`,
      });
      return;
    }

    this.coverFile = file;
    this.createBookForm.patchValue({ cover: file });
    this.createBookForm.get('cover')?.updateValueAndValidity();
  }
}


  // Handle form submission
  // Handle form submission
onSubmit(): void {
  if (this.createBookForm.invalid || !this.coverFile) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulaire invalide',
      text: 'Veuillez remplir tous les champs requis et sélectionner une couverture valide.',
    });
    return;
  }

  // Serialize form data into JSON for bookDTO
  const bookDTO = JSON.stringify({
    title: this.createBookForm.value.title,
    author: this.createBookForm.value.author,
    sujet: this.createBookForm.value.sujet,
    category: this.createBookForm.value.category,
  });

  // Create FormData to send JSON and file
  const formData = new FormData();
  formData.append('bookDTO', bookDTO);
  formData.append('cover', this.coverFile);

  // Send the form data to the backend
  this.bookService.createBook(formData).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: response.message || 'Livre ajouté',
        text: 'Le livre a été ajouté avec succès.',
        timer: 2000,
        showConfirmButton: false,
      });

      this.createBookForm.reset();
      this.coverFile = null;
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout du livre :', err);  // Log full error here to check what is being returned
      const errorMessage = err.error?.error || 'Une erreur est survenue lors de l\'ajout du livre.';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
      });
    },
  });
}

}
