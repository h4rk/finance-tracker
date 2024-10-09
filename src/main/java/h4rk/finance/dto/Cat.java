package h4rk.finance.dto;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table("cat")
public class Cat {
    @Column("cat_id")
    private long id;

    @Column("name")
    private String name;
    
    @Column("description")
    private String description;
    
    @Column("cat_type")
    private short type;
}
