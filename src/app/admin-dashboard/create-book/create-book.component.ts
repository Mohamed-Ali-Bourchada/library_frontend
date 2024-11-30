import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookservicesService } from '../../services/bookServices/bookservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-book',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
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
    'educative'];  // Liste de catégories
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookservicesService
  ) {
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
  coverFile: File | null = null; 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      console.log('Fichier sélectionné :', file);
  
      // Mettre à jour la variable coverFile
      this.coverFile = file;
  
      // Mettre à jour la valeur du champ "cover" dans le formulaire
      this.createBookForm.patchValue({ cover: file });
  
      // Rafraîchir la validation du formulaire
      this.createBookForm.get('cover')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {

    if (this.createBookForm.invalid || !this.coverFile) {
      console.log('Formulaire ou fichier invalide.');
      return;
    }
  
    // Sérialisation des données du formulaire en JSON pour bookDTO
    const bookDTO = JSON.stringify({
      title: this.createBookForm.value.title,
      author: this.createBookForm.value.author,
      sujet: this.createBookForm.value.sujet,
      category: this.createBookForm.value.category,
    });
  
    // Création d'un objet FormData pour envoyer le JSON et le fichier
    const formData = new FormData();
    formData.append('bookDTO', bookDTO);  // Sérialisation de bookDTO en tant que chaîne JSON
    formData.append('cover', this.coverFile);  // Ajout du fichier de couverture
  
    // Envoi du FormData au backend
    this.bookService.createBook(formData).subscribe({
      next: (response) => {
        console.log('Livre ajouté avec succès :', response);

      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du livre :', err);
        this.errorMessage = 'Une erreur est survenue lors de l\'ajout du livre.';
      },
    });
  }
  
  
  
}
