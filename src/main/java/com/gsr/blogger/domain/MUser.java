package com.gsr.blogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A MUser.
 */
@Entity
@Table(name = "m_user")
public class MUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "dob")
    private Instant dob;

    @Column(name = "about")
    private String about;

    @JsonIgnoreProperties(value = { "mUser" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserStatistic userStatistic;

    @OneToMany(mappedBy = "muser")
    @JsonIgnoreProperties(value = { "posts", "muser" }, allowSetters = true)
    private Set<Channel> channels = new HashSet<>();

    @OneToMany(mappedBy = "muser")
    @JsonIgnoreProperties(value = { "comments", "muser", "channels" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    @OneToMany(mappedBy = "muser")
    @JsonIgnoreProperties(value = { "post", "muser" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MUser id(Long id) {
        this.id = id;
        return this;
    }

    public String getUsername() {
        return this.username;
    }

    public MUser username(String username) {
        this.username = username;
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public MUser email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getDob() {
        return this.dob;
    }

    public MUser dob(Instant dob) {
        this.dob = dob;
        return this;
    }

    public void setDob(Instant dob) {
        this.dob = dob;
    }

    public String getAbout() {
        return this.about;
    }

    public MUser about(String about) {
        this.about = about;
        return this;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public UserStatistic getUserStatistic() {
        return this.userStatistic;
    }

    public MUser userStatistic(UserStatistic userStatistic) {
        this.setUserStatistic(userStatistic);
        return this;
    }

    public void setUserStatistic(UserStatistic userStatistic) {
        this.userStatistic = userStatistic;
    }

    public Set<Channel> getChannels() {
        return this.channels;
    }

    public MUser channels(Set<Channel> channels) {
        this.setChannels(channels);
        return this;
    }

    public MUser addChannel(Channel channel) {
        this.channels.add(channel);
        channel.setMuser(this);
        return this;
    }

    public MUser removeChannel(Channel channel) {
        this.channels.remove(channel);
        channel.setMuser(null);
        return this;
    }

    public void setChannels(Set<Channel> channels) {
        if (this.channels != null) {
            this.channels.forEach(i -> i.setMuser(null));
        }
        if (channels != null) {
            channels.forEach(i -> i.setMuser(this));
        }
        this.channels = channels;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public MUser posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public MUser addPost(Post post) {
        this.posts.add(post);
        post.setMuser(this);
        return this;
    }

    public MUser removePost(Post post) {
        this.posts.remove(post);
        post.setMuser(null);
        return this;
    }

    public void setPosts(Set<Post> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setMuser(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setMuser(this));
        }
        this.posts = posts;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public MUser comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public MUser addComment(Comment comment) {
        this.comments.add(comment);
        comment.setMuser(this);
        return this;
    }

    public MUser removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setMuser(null);
        return this;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setMuser(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setMuser(this));
        }
        this.comments = comments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MUser)) {
            return false;
        }
        return id != null && id.equals(((MUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MUser{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", email='" + getEmail() + "'" +
            ", dob='" + getDob() + "'" +
            ", about='" + getAbout() + "'" +
            "}";
    }
}
