import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';


export function angularMaterialModulesUtil(){
    return [
        MatFormFieldModule, 
        MatInputModule, 
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatIconModule,
        MatCardModule,
        MatRadioModule
    ]
}