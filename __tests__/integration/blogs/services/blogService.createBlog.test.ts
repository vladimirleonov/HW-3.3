import { blogMongoRepository} from "../../../../src/features/blogs/repository/blogMongoRepository";
import { blogService} from "../../../../src/features/blogs/services/blogService";
import {testSeeder} from "../../../testSeeder";
import {InputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types";

describe('blogService.createBlog', () => {
    it('should create a new blog', async () => {
        // Создаем заглушку для метода create вашего репозитория
        const createBlogMock = jest.spyOn(blogMongoRepository, 'create');
        createBlogMock.mockResolvedValue('blogId123'); // Предположим, что репозиторий возвращает id созданного блога

        // Вызываем метод createBlog вашего сервиса с какими-то данными
        const input: InputBlogType = testSeeder.createBlogDTO()
        const blogId = await blogService.createBlog(input);

        // Проверяем, что метод create вашего репозитория был вызван с правильными аргументами
        expect(createBlogMock).toHaveBeenCalledWith(/* ожидаемые аргументы */);

        // Проверяем, что метод create вашего репозитория вернул ожидаемый id блога
        expect(blogId).toBe('blogId123');
    });
});