package ofl.sandbox.db.csv;

import java.io.File;

import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.stereotype.Component;

import com.mchange.v2.c3p0.DataSources;

@Component("CsvDataSource")
public class CsvDatabaseSource {


	public static final String CSV_DATA_DIR = "testdb";

	public String databaseDriver;
	
	@Bean(name = "dataSource")
	public DataSource dataSource() throws Exception {
		return getDataSource(CSV_DATA_DIR);
	}
	
	public String getDatabaseDriverClassName() {
		return databaseDriver;
	}
	
	/**
	 * Create a DataSource using the given source directory as the database csv data source
	 * @param csvDataDir	directory on classpath 
	 * @return CSV DataSource 
	 * @throws Exception if unable to initialise the datasource due to the provided csvDataDir not being found, 
	 * 	or not being a directory.
	 */
	//http://csvjdbc.sourceforge.net/develop.html
	public DataSource getDataSource(String csvDataDir) throws Exception {

        //Create a data source and use it to create a JDBC template.
//        BasicDataSource basicDataSource = new BasicDataSource();
//		SimpleDriverDataSource basicDataSource = new SimpleDriverDataSource();

//        DataSource ds_unpooled = DataSources.unpooledDataSource(persistenceUrl,
//                persistenceUsername,
//                persistencePassword);
        
        
        Resource resource = new ClassPathResource(csvDataDir);
		 
		if(!resource.exists()) {
			throw new Exception("Cannot find CSV Data Directory");
		}
		
		File fileDir = resource.getFile();
		if(!fileDir.isDirectory()) {
			throw new Exception("Resource is not a directory");
		}
		String jdbcUrl = "jdbc:relique:csv:" + fileDir.getAbsolutePath();
		
		DataSource basicDataSource = DataSources.unpooledDataSource(jdbcUrl);
				
//		basicDataSource.setUrl(jdbcUrl);
		
		return basicDataSource;

        ////Columns treated as strings by default.  Use columnTypes property to change this.  See all connection
        //properties at http://csvjdbc.sourceforge.net/doc.html.
        //        ds.setConnectionProperties("columnTypes=string,string,int,int");
//        JdbcTemplate template = new JdbcTemplate(ds);
		

        //Query for all people under the age of 30 using the JDBC template.
//        List<String> results = template.queryForList(query, String.class);

        //Print the results.  Displays: "[Ian Smith - 24, Amy Doe - 29]" when run.
//        System.out.println(results);
	}
	
	/**
	 * TODO: Currently throws an exception on shutdown - 
	 * 
	 * 23:11:08.156 [Thread-1] WARN org.apache.commons.dbcp2.BasicDataSource - Failed to unregister the JMX name: org.apache.commons.dbcp2:name=dataSource,type=BasicDataSource
javax.management.InstanceNotFoundException: org.apache.commons.dbcp2:name=dataSource,type=BasicDataSource
	at com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.getMBean(Unknown Source)
	at com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.exclusiveUnregisterMBean(Unknown Source)
	at com.sun.jmx.interceptor.DefaultMBeanServerInterceptor.unregisterMBean(Unknown Source)
	at com.sun.jmx.mbeanserver.JmxMBeanServer.unregisterMBean(Unknown Source)
	at org.apache.commons.dbcp2.BasicDataSource.close(BasicDataSource.java:1917)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
	at java.lang.reflect.Method.invoke(Unknown Source)
	at org.springframework.beans.factory.support.DisposableBeanAdapter.invokeCustomDestroyMethod(DisposableBeanAdapter.java:364)
	at org.springframework.beans.factory.support.DisposableBeanAdapter.destroy(DisposableBeanAdapter.java:287)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.destroyBean(DefaultSingletonBeanRegistry.java:578)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.destroySingleton(DefaultSingletonBeanRegistry.java:554)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.destroySingleton(DefaultListableBeanFactory.java:976)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.destroySingletons(DefaultSingletonBeanRegistry.java:523)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.destroySingletons(DefaultListableBeanFactory.java:983)
	at org.springframework.context.support.AbstractApplicationContext.destroyBeans(AbstractApplicationContext.java:1028)
	at org.springframework.context.support.AbstractApplicationContext.doClose(AbstractApplicationContext.java:1004)
	at org.springframework.context.support.AbstractApplicationContext$2.run(AbstractApplicationContext.java:923)
	 */
	
}
