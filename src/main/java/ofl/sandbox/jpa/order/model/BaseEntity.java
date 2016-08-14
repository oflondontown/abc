package ofl.sandbox.jpa.order.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class BaseEntity {

//	@Column(name = "created", nullable = false,  updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
	@CreatedDate // column will be populated with name of the principal that created the entity
//    private long created = System.currentTimeMillis();
    private Date created;
	
//	@Column(name = "lastUpdated", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
	@LastModifiedDate // column will be populated with name of the principal that last modified the entity
//	private long lastUpdated = System.currentTimeMillis();
	private Date lastUpdated;
	
	@Version
	@Column(name = "version")
	protected int version;
	
	public int getVersion() {
		return version;
	}
	
	public void setVersion(int version) {
		this.version = version;
	}
	
	public Date getLastUpdated() {
		return lastUpdated;
	}
	

	public Date getCreated() {
		return created;
	}

    public void setCreated(Date createdDate) {
        this.created = createdDate;
    }


    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    public String toString() {
    	return "Created="+ created +",LastUpdated=" + lastUpdated +",Version="+version;
    }
	
/* annotations do not seem to be compatible with Spring Data JPA
 * 
 *     @PreUpdate
    public void preUpdate() {
    	lastUpdated = System.currentTimeMillis();
    	version++;
    }
	
    @PrePersist
    public void prePersist() {
    	long now = System.currentTimeMillis();
    	lastUpdated = now;
    	created		= now;
    	version = 1;
    }*/
}