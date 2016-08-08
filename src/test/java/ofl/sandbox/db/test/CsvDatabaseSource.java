//package ofl.sandbox.db.test;
//
//import java.io.File;
//
//import javax.sql.DataSource;
//
//import org.apache.commons.dbcp2.BasicDataSource;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Profile;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.core.io.Resource;
//import org.springframework.stereotype.Component;
//
//
//@Profile("TEST")
//@Component("CsvDataSource")
//public class CsvDatabaseSource {
//
//
//	public static final String CSV_DATA_DIR = "testdb";
//
//	@Bean(name = "dataSource")
//	public static DataSource dataSource() throws Exception {
//		return getDataSource(CSV_DATA_DIR);
//	}
//	
//	/**
//	 * Create a DataSource using the given source directory as the database csv data source
//	 * @param csvDataDir	directory on classpath 
//	 * @return CSV DataSource 
//	 * @throws Exception if unable to initialise the datasource due to the provided csvDataDir not being found, 
//	 * 	or not being a directory.
//	 */
//	//http://csvjdbc.sourceforge.net/develop.html
//	@Bean
//	public static DataSource getDataSource(String csvDataDir) throws Exception {
//
//        //Create a data source and use it to create a JDBC template.
//        BasicDataSource basicDataSource = new BasicDataSource();
//        
//		Resource resource = new ClassPathResource(csvDataDir);
//		
//		if(!resource.exists()) {
//			throw new Exception("Cannot find CSV Data Directory");
//		}
//		
//		File fileDir = resource.getFile();
//		if(!fileDir.isDirectory()) {
//			throw new Exception("Resource is not a directory");
//		}
//				
//		basicDataSource.setUrl("jdbc:relique:csv:" + fileDir.getAbsolutePath());
//		
//		return basicDataSource;
//
//        ////Columns treated as strings by default.  Use columnTypes property to change this.  See all connection
//        //properties at http://csvjdbc.sourceforge.net/doc.html.
//        //        ds.setConnectionProperties("columnTypes=string,string,int,int");
////        JdbcTemplate template = new JdbcTemplate(ds);
//		
//
//        //Query for all people under the age of 30 using the JDBC template.
////        List<String> results = template.queryForList(query, String.class);
//
//        //Print the results.  Displays: "[Ian Smith - 24, Amy Doe - 29]" when run.
////        System.out.println(results);
//	}
//	
//}
