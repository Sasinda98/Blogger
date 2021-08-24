package com.gsr.blogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Channel.
 */
@Entity
@Table(name = "channel")
public class Channel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "modified_at")
    private Instant modifiedAt;

    @Column(name = "last_post_at")
    private Instant lastPostAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @ManyToMany
    @JoinTable(
        name = "rel_channel__posts",
        joinColumns = @JoinColumn(name = "channel_id"),
        inverseJoinColumns = @JoinColumn(name = "posts_id")
    )
    @JsonIgnoreProperties(value = { "comments", "postCreator", "channels" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "statistic", "channels", "posts", "comments" }, allowSetters = true)
    private MUser channelCreator;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Channel id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Channel name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Channel createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getModifiedAt() {
        return this.modifiedAt;
    }

    public Channel modifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public void setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Instant getLastPostAt() {
        return this.lastPostAt;
    }

    public Channel lastPostAt(Instant lastPostAt) {
        this.lastPostAt = lastPostAt;
        return this;
    }

    public void setLastPostAt(Instant lastPostAt) {
        this.lastPostAt = lastPostAt;
    }

    public Boolean getIsDeleted() {
        return this.isDeleted;
    }

    public Channel isDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
        return this;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public Channel posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public Channel addPosts(Post post) {
        this.posts.add(post);
        post.getChannels().add(this);
        return this;
    }

    public Channel removePosts(Post post) {
        this.posts.remove(post);
        post.getChannels().remove(this);
        return this;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }

    public MUser getChannelCreator() {
        return this.channelCreator;
    }

    public Channel channelCreator(MUser mUser) {
        this.setChannelCreator(mUser);
        return this;
    }

    public void setChannelCreator(MUser mUser) {
        this.channelCreator = mUser;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Channel)) {
            return false;
        }
        return id != null && id.equals(((Channel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Channel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", modifiedAt='" + getModifiedAt() + "'" +
            ", lastPostAt='" + getLastPostAt() + "'" +
            ", isDeleted='" + getIsDeleted() + "'" +
            "}";
    }
}
