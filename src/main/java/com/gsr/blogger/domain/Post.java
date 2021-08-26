package com.gsr.blogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gsr.blogger.domain.enumeration.ViewScope;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "likes")
    private Integer likes;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "modified_at")
    private Instant modifiedAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    @Column(name = "view_scope")
    private ViewScope viewScope;

    @OneToMany(mappedBy = "linkedPost")
    @JsonIgnoreProperties(value = { "linkedPost", "commentCreator" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "statistic", "channels", "posts", "comments" }, allowSetters = true)
    private MUser postCreator;

    @ManyToMany(mappedBy = "relatedPosts")
    @JsonIgnoreProperties(value = { "relatedPosts", "channelCreator" }, allowSetters = true)
    private Set<Channel> relatedChannels = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post id(Long id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return this.title;
    }

    public Post title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public Post content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikes() {
        return this.likes;
    }

    public Post likes(Integer likes) {
        this.likes = likes;
        return this;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Post createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getModifiedAt() {
        return this.modifiedAt;
    }

    public Post modifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public void setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Boolean getIsDeleted() {
        return this.isDeleted;
    }

    public Post isDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
        return this;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public ViewScope getViewScope() {
        return this.viewScope;
    }

    public Post viewScope(ViewScope viewScope) {
        this.viewScope = viewScope;
        return this;
    }

    public void setViewScope(ViewScope viewScope) {
        this.viewScope = viewScope;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public Post comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public Post addComment(Comment comment) {
        this.comments.add(comment);
        comment.setLinkedPost(this);
        return this;
    }

    public Post removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setLinkedPost(null);
        return this;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setLinkedPost(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setLinkedPost(this));
        }
        this.comments = comments;
    }

    public MUser getPostCreator() {
        return this.postCreator;
    }

    public Post postCreator(MUser mUser) {
        this.setPostCreator(mUser);
        return this;
    }

    public void setPostCreator(MUser mUser) {
        this.postCreator = mUser;
    }

    public Set<Channel> getRelatedChannels() {
        return this.relatedChannels;
    }

    public Post relatedChannels(Set<Channel> channels) {
        this.setRelatedChannels(channels);
        return this;
    }

    public Post addRelatedChannel(Channel channel) {
        this.relatedChannels.add(channel);
        channel.getRelatedPosts().add(this);
        return this;
    }

    public Post removeRelatedChannel(Channel channel) {
        this.relatedChannels.remove(channel);
        channel.getRelatedPosts().remove(this);
        return this;
    }

    public void setRelatedChannels(Set<Channel> channels) {
        if (this.relatedChannels != null) {
            this.relatedChannels.forEach(i -> i.removeRelatedPost(this));
        }
        if (channels != null) {
            channels.forEach(i -> i.addRelatedPost(this));
        }
        this.relatedChannels = channels;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            ", likes=" + getLikes() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", modifiedAt='" + getModifiedAt() + "'" +
            ", isDeleted='" + getIsDeleted() + "'" +
            ", viewScope='" + getViewScope() + "'" +
            "}";
    }
}
