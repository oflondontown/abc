package ofl.sandbox.jpa.book;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ofl.sandbox.jpa.book.model.Book;
import ofl.sandbox.jpa.book.model.BookCategory;
import ofl.sandbox.jpa.book.repository.BookCategoryRepository;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;


@Component("BookApp")
public class BookApp {

    @Autowired
    private BookCategoryRepository bookCategoryRepository;
    
    
    @Transactional
    public void run(String... strings) throws Exception {
    	// save a couple of categories
        BookCategory categoryA = new BookCategory("Category A");
        Set<Book> bookAs = new HashSet<Book>(){/**
			 * 
			 */
			private static final long serialVersionUID = 1L;

		{
            add(new Book("Book A1", categoryA));
            add(new Book("Book A2", categoryA));
            add(new Book("Book A3", categoryA));
        }};
        categoryA.setBooks(bookAs);

        BookCategory categoryB = new BookCategory("Category B");
        Set<Book> bookBs = new HashSet<Book>(){/**
			 * 
			 */
			private static final long serialVersionUID = 1L;

		{
            add(new Book("Book B1", categoryB));
            add(new Book("Book B2", categoryB));
            add(new Book("Book B3", categoryB));
        }};
        categoryB.setBooks(bookBs);

        bookCategoryRepository.save(new HashSet<BookCategory>() {/**
			 * 
			 */
			private static final long serialVersionUID = 1L;

		{
            add(categoryA);
            add(categoryB);
        }});

        // fetch all categories
        for (BookCategory bookCategory : bookCategoryRepository.findAll()) {
            System.out.println("BOOK CATEGORY ::: " + bookCategory.toString());
        }
    }
}
