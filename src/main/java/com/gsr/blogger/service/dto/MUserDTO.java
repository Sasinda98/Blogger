package com.gsr.blogger.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.gsr.blogger.domain.MUser} entity.
 */
public class MUserDTO implements Serializable {

    private Long id;

    private String username;

    private String email;

    private Instant dob;

    private String about;

    private UserStatisticDTO userStatistic;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getDob() {
        return dob;
    }

    public void setDob(Instant dob) {
        this.dob = dob;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public UserStatisticDTO getUserStatistic() {
        return userStatistic;
    }

    public void setUserStatistic(UserStatisticDTO userStatistic) {
        this.userStatistic = userStatistic;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MUserDTO)) {
            return false;
        }

        MUserDTO mUserDTO = (MUserDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, mUserDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MUserDTO{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", email='" + getEmail() + "'" +
            ", dob='" + getDob() + "'" +
            ", about='" + getAbout() + "'" +
            ", userStatistic=" + getUserStatistic() +
            "}";
    }
}
