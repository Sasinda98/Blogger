package com.gsr.blogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A UserStatistic.
 */
@Entity
@Table(name = "user_statistic")
public class UserStatistic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "last_active")
    private Instant lastActive;

    @Column(name = "number_of_posts")
    private Integer numberOfPosts;

    @Column(name = "number_of_comments")
    private Integer numberOfComments;

    @JsonIgnoreProperties(value = { "statistic", "channels", "posts", "comments" }, allowSetters = true)
    @OneToOne(mappedBy = "statistic")
    private MUser linkedUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserStatistic id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getLastActive() {
        return this.lastActive;
    }

    public UserStatistic lastActive(Instant lastActive) {
        this.lastActive = lastActive;
        return this;
    }

    public void setLastActive(Instant lastActive) {
        this.lastActive = lastActive;
    }

    public Integer getNumberOfPosts() {
        return this.numberOfPosts;
    }

    public UserStatistic numberOfPosts(Integer numberOfPosts) {
        this.numberOfPosts = numberOfPosts;
        return this;
    }

    public void setNumberOfPosts(Integer numberOfPosts) {
        this.numberOfPosts = numberOfPosts;
    }

    public Integer getNumberOfComments() {
        return this.numberOfComments;
    }

    public UserStatistic numberOfComments(Integer numberOfComments) {
        this.numberOfComments = numberOfComments;
        return this;
    }

    public void setNumberOfComments(Integer numberOfComments) {
        this.numberOfComments = numberOfComments;
    }

    public MUser getLinkedUser() {
        return this.linkedUser;
    }

    public UserStatistic linkedUser(MUser mUser) {
        this.setLinkedUser(mUser);
        return this;
    }

    public void setLinkedUser(MUser mUser) {
        if (this.linkedUser != null) {
            this.linkedUser.setStatistic(null);
        }
        if (mUser != null) {
            mUser.setStatistic(this);
        }
        this.linkedUser = mUser;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserStatistic)) {
            return false;
        }
        return id != null && id.equals(((UserStatistic) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserStatistic{" +
            "id=" + getId() +
            ", lastActive='" + getLastActive() + "'" +
            ", numberOfPosts=" + getNumberOfPosts() +
            ", numberOfComments=" + getNumberOfComments() +
            "}";
    }
}
