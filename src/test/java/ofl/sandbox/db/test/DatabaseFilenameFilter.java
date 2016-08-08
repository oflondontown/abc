package ofl.sandbox.db.test;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

public class DatabaseFilenameFilter implements FilenameFilter {

	private final Set<String> extensions;

	public DatabaseFilenameFilter(String... extensions) {
		this.extensions = extensions == null ? Collections.emptySet()
				: Arrays.stream(extensions).map(e -> e.toLowerCase()).collect(Collectors.toSet());
	}

	@Override
	public boolean accept(File dir, String name) {
		return extensions.isEmpty() || extensions.contains(getFileExtension(name));
	}

	private String getFileExtension(String filename) {
		String ext = null;
		int i = filename.lastIndexOf('.');
		if (i != -1 && i < filename.length()) {
			ext = filename.substring(i + 1).toLowerCase();
		}
		return ext;
	}
}
