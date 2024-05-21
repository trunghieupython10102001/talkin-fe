import { Request } from 'express';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getCategory(req: Request): Promise<any>;
    createCategory(body: CreateCategoryDTO): Promise<any>;
}
