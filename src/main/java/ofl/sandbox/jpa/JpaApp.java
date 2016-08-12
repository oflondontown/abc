package ofl.sandbox.jpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import ofl.sandbox.jpa.model.Book;
import ofl.sandbox.jpa.model.BookCategory;
import ofl.sandbox.jpa.repository.BookCategoryRepository;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;


@SpringBootApplication
public class JpaApp implements CommandLineRunner {

    @Autowired
    private BookCategoryRepository bookCategoryRepository;
    

    public static void main(String[] args) {
        SpringApplication.run(JpaApp.class, args);
    }
    
    @Override
    @Transactional
    public void run(String... strings) throws Exception {
        // save a couple of categories
        BookCategory categoryA = new BookCategory("Category A");
        Set bookAs = new HashSet<Book>(){{
            add(new Book("Book A1", categoryA));
            add(new Book("Book A2", categoryA));
            add(new Book("Book A3", categoryA));
        }};
        categoryA.setBooks(bookAs);

        BookCategory categoryB = new BookCategory("Category B");
        Set bookBs = new HashSet<Book>(){{
            add(new Book("Book B1", categoryB));
            add(new Book("Book B2", categoryB));
            add(new Book("Book B3", categoryB));
        }};
        categoryB.setBooks(bookBs);

        bookCategoryRepository.save(new HashSet<BookCategory>() {{
            add(categoryA);
            add(categoryB);
        }});

        // fetch all categories
        for (BookCategory bookCategory : bookCategoryRepository.findAll()) {
            System.out.println("BOOK CATEGORY ::: " + bookCategory.toString());
        }
    }
}
