import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

export function angularMaterialModulesUtil(){
    return [
        MatFormFieldModule, 
        MatInputModule, 
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule
    ]
}