package ofl.sandbox.db.test;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

import javax.sql.DataSource;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

public class EmbeddedDataSource {
	
	protected FilenameFilter fileFilter = new DatabaseFilenameFilter("csv", "sql");

	public DataSource getDataSource() {

		// no need shutdown, EmbeddedDatabaseFactoryBean will take care of this
		EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
		builder = builder.setType(EmbeddedDatabaseType.H2);  //.HSQL or .DERBY
		
		Resource resource = new ClassPathResource("testdb");
		
		if(resource.exists()) {
			File fileDir;
			try {
				fileDir = resource.getFile();
				if(fileDir.isDirectory()) {
					
					for(File file : fileDir.listFiles(fileFilter)) {
						if(file.isFile()) {
							builder = addScript(builder, file);
						}
					}
				} else if(fileDir.isFile()) {
					if(fileFilter.accept(fileDir.getParentFile(),  fileDir.getName())) {
						builder = addScript(builder, fileDir);
					}
					
//					EmbeddedDatabase db = builder
//						.addScript("db/sql/create-db.sql")
//						.addScript("db/sql/insert-data.sql")
//						.build();
					
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return builder.build();
	}
	
	private EmbeddedDatabaseBuilder addScript(EmbeddedDatabaseBuilder builder, File file) {
		return builder.addScript(file.getAbsolutePath());

	}
	
}
